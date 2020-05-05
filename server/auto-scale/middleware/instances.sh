#!/bin/sh
aws lightsail get-instances --region=ap-south-1 >> ./middleware/south.json
aws lightsail get-instances --region=ap-southeast-1 >> ./middleware/southeast.json