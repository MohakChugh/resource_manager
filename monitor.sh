#!/bin/bash
#network
#Mike.Xu
while : ; do
      time='date +%m"-"%d" "%k":"%M'
      day='date +%m"-"%d'
      rx_before='ifconfig eth0|sed -n "8"p|awk '{print $2}'|cut -c7-'
      tx_before='ifconfig eth0|sed -n "8"p|awk '{print $6}'|cut -c7-'
      sleep 2
      rx_after='ifconfig eth0|sed -n "8"p|awk '{print $2}'|cut -c7-'
      tx_after='ifconfig eth0|sed -n "8"p|awk '{print $6}'|cut -c7-'
      rx_result='$[(rx_after-rx_before)/256]'
      tx_result='$[(tx_after-tx_before)/256]'
      echo "$time Now_In_Speed: "$rx_result"kbps Now_OUt_Speed: "$tx_result"kbps"
      sleep 2
done

#systemstat.sh
#Mike.Xu
IP=192.168.1.227
top -n 2| grep "Cpu" >>./temp/cpu.txt
free -m | grep "Mem" >> ./temp/mem.txt
df -k | grep "sda1" >> ./temp/drive_sda1.txt
#df -k | grep sda2 >> ./temp/drive_sda2.txt
df -k | grep "/mnt/storage_0" >> ./temp/mnt_storage_0.txt
df -k | grep "/mnt/storage_pic" >> ./temp/mnt_storage_pic.txt
time=`date +%m"."%d" "%k":"%M`
connect=`netstat -na | grep "219.238.148.30:80" | wc -l`
echo "$time  $connect" >> ./temp/connect_count.txt

#monitor available disk space
SPACE='df | sed -n '/\/$/p' | gawk '{print $5}' | sed  's/%//
if [ $SPACE -ge 90 ]
then
me.mohakchugh@gmail.com
fi

#script  to capture system statistics
OUTFILE=/home/xu/capstats.csv
DATE='date +%m/%d/%Y'
TIME='date +%k:%m:%s'
TIMEOUT='uptime'
VMOUT='vmstat 1 2'
 USERS='echo $TIMEOUT | gawk '{print $4}' '
LOAD='echo $TIMEOUT | gawk '{print $9}' | sed "s/,//' '
FREE='echo $VMOUT | sed -n '/[0-9]/p' | sed -n '2p' | gawk '{print $4} ' '
IDLE='echo  $VMOUT | sed -n '/[0-9]/p' | sed -n '2p' |gawk '{print $15}' 
echo "$DATE,$TIME,$USERS,$LOAD,$FREE,$IDLE" >> $OUTFILE