#!/bin/bash
docker run --name nginx-proxy -d --network host -v $(pwd)/nginx:/etc/nginx/conf.d nginx
