# System Monitor
System monitor is used to monitor the status of all of our running instances, and spin up new instances in our cluster
when ever required.

## The idea
The idea is to replicate the functionality of horizontal scalling of EC2, but on lightsail, and monitoring the resources/health of all of our instances, 
replicating some basic functionality of CloudWatch

## Components of system monitor
The system monitor consists of 2 parts.
1. The useage_monitor. It's a script in the server folder named as monitor.js. It is required to be running on all of our servers. 
It sends back the CPU and Memory Usage to the main master server

2. The master. The master is the main server which performs 2 main tasks : 
    -   The vertical scaling using kubernetes. (already configured)
    -   The horizontal scaling. This is done by using the monitoring systems. As soon as the `CPu or memory usage` is above `80%`, 
        it spins up 2 new instances as a slave to the kubernetes master, which would then autoscale vertically, and balance the resources.
        And reduce the number of lightsail instances by 2 when the `cpu usage` or `memory usage` is below `50%`
    
The master stores the information in a local mongodb instance, and only the latest 20 entries are saved, Rest all the previous entries are deleted!

The resources of a particular instance is monitored at an interval of every 2 minutes.

#### The Request which is made to the main server to monitor/save the resources of an instances

```js
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("cpu_usage", "65");
urlencoded.append("percentage_memory_available", "71");

var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
};

fetch("http://localhost:8080/", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
```

#### The request to get the data of last 20 entires

```js
var urlencoded = new URLSearchParams();

var requestOptions = {
    method: 'GET',
    body: urlencoded,
    redirect: 'follow'
};

fetch("http://localhost:8080/", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
```

#### The request to get the information of all the instances running

```js
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch("http://localhost:8080", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
```

## How to spin up new instances

When the resources are being monitored, the master server checks the cpu and memory usage of every instance running.
If it is above the upper limit of 80%, or below the lower limit of 60%, new instance is created using the aws-cli

#### The script to spin up new instances in the given 

To create a new instance, the pem file is required. The command required to run the script is
```
./create-cluster.sh ./mohak-k8s-test.pem                                                                                                   ─╯
```
Here, the 2nd argument is the path to your aws `.pem` file.

<u>Prerequists</u>
- Make sure you insall aws-cli and configure aws-cli using the command `aws configure` before running the scripts


```bash
#! /bin/bash 

if [ "$1" == "" ]; then
    echo "No key file specified - please provide the path to your SSH key"
    exit 1
fi 

echo "Creating Lightsail instances . . . . "
echo "+++++++++++++++++++++++++++++++++++++"

for i in `seq 1 3`; do 
    aws lightsail create-instances \
    --instance-names kube-$i \
    --availability-zone ap-south-1a \
    --blueprint-id ubuntu_16_04_2 \
    --bundle-id medium_2_1 \
    --user-data "$(cat ./install-prereqs.sh)"
done

echo "Sleeping for 120 seconds to allow instances to boot up"
echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++"

sleep 120

MASTER_PUB_IP=$(aws lightsail get-instance --instance-name kube-1 | jq -r '.instance.publicIpAddress')
MASTER_PRIV_IP=$(aws lightsail get-instance --instance-name kube-1 | jq -r '.instance.privateIpAddress')
WORKER_1_PUB_IP=$(aws lightsail get-instance --instance-name kube-2 | jq -r '.instance.publicIpAddress')
WORKER_2_PUB_IP=$(aws lightsail get-instance --instance-name kube-3 | jq -r '.instance.publicIpAddress')
HOME=/home/ubuntu
KEY=$1


echo "Master Public IP " $MASTER_PUB_IP
echo "Master Private IP " $MASTER_PRIV_IP


echo "Initializing master node"
echo "++++++++++++++++++++++++"
     
ssh -q -i $KEY ubuntu@$MASTER_PUB_IP sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=$MASTER_PRIV_IP

ssh -q -i $KEY ubuntu@$MASTER_PUB_IP mkdir -p $HOME/.kube
ssh -q -i $KEY ubuntu@$MASTER_PUB_IP sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
ssh -q -i $KEY ubuntu@$MASTER_PUB_IP sudo chown 1000:1000 $HOME/.kube/config


ssh -q -i $KEY ubuntu@$MASTER_PUB_IP kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/bc79dd1505b0c8681ece4de4c0d86c5cd2643275/Documentation/kube-flannel.yml

echo "Joining 1st worker (IP: " $WORKER_1_PUB_IP ")"
echo "++++++++++++++++++"

JOIN=$(ssh -q -i $KEY ubuntu@$MASTER_PUB_IP sudo kubeadm token create --print-join-command) && echo $JOIN

ssh -q -i $KEY ubuntu@$WORKER_1_PUB_IP sudo $JOIN

echo "Joining 2nd worker (IP: " $WORKER_2_PUB_IP ")"
echo "++++++++++++++++++"

ssh -q -i $KEY ubuntu@$WORKER_2_PUB_IP sudo $JOIN

echo "Cluster up and running"

ssh -q -i $KEY ubuntu@$MASTER_PUB_IP kubectl get nodes
```

#### The script to delete instances

```bash
#! /bin/bash 

for i in `seq 1 3`; do 
    aws lightsail delete-instance --instance-name kube-$i
done
```

#### To add custom commands while creating a new lightsail
The install-prereqs script is a collection of commands which is run on every new instance that is created.
The install-prereqs as of now contains the following code, which installs the dependencies for kubernetes, and joins it to the master.

```bash
curl -sSL https://get.docker.com | sh 
usermod -aG docker ubuntu
apt-get update && apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl
sudo kubeadm join 172.26.12.194:6443 --token m0rzhq.z5w9f56bkhh3qtv7 \
    --discovery-token-ca-cert-hash sha256:73e432e7b2dd71fe4cd2a0f6ad93f8c7562ff8826d8ccd48f14c18c069dc7772
```
Any new command added to the file will be run on the creation of every new instance.


### To create Documentation of the Postman collection
[Use Docgen](https://github.com/thedevsaddam/docgen-bin)

