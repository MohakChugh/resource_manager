This is a simple set of scripts to create a Kubernetes cluster on lightsail. 

## Prerequisites

* You need to have downloaded the default SSH key for your Lightsail instances.
* The script uses the AWS cli to create the Lightsail instances, so you will need that installed and configured on your local machine. The instances will be created in whatever is configured as the default region for the CLI

## Usage

* Clone this repo onto your local machine

* Chage into the repo directory

* Make sure all the scripts are executable

        sudo chmod +x *.sh

* Execute the script passing in the path to your Lightsail SSH key

        ./create-cluster.sh /path/to/your/lightsail.pem

## What's Happening

The script first  provisions 3 Lightsail small instances, as part of the provisioning process it installs the latest versions of Docker, Kubectl, Kubeadm, and Kubelet.

It then installs Flannel for the pod networking. 

Finally, it uses Kubeadm to create a master node, and after that's done it uses Kubeadm to add two workers. 