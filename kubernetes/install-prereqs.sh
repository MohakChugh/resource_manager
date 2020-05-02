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