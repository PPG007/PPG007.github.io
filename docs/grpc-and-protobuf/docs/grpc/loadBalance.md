# Load Balance

## NO TLS

修改 Nginx 配置文件：

```conf
worker_processes auto;
error_log /var/log/nginx/error.log;
events {
	worker_connections 768;
}

http {
	access_log /var/log/nginx/access.log;

	upstream hello_services {
		server 0.0.0.0:8081;
		server 0.0.0.0:8082;
	}

	server {
		listen	80 http2;
		location / {
			grpc_pass grpc://hello_services;
		}
	}
}
```

将 gRPC 服务端启动在对应的端口即可，访问 Nginx 监听的 80 端口即可访问 gRPC 的接口。

## TLS

TODO
