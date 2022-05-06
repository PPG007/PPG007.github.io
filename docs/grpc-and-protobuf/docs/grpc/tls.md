# SSL TLS

流程：服务端具有一个公钥和一个私钥，首先服务端创建证书签名 CSR，其中包含服务端的公钥和一些身份信息，然后服务端使用私钥签署了 CSR 并发送给 CA，CA 使用服务端的公钥验证 CSR 签名，这样就验证了一对对应的私钥和公钥，之后（此时证书应该不是被服务单私钥加密的状态） CA 使用自己的私钥在证书上签名然后返回给服务端，服务端与客户端共享这个证书，客户端可以使用 CA 的公钥对证书进行验证并获取到服务端的公钥。

首先使用 OpenSSL 生成 CA 密钥和证书、服务端密钥和证书、客户端密钥和证书：

```sh
# 1. Generate CA's private key and self-signed certificate
openssl req -x509 -newkey rsa:4096 -days 365 -nodes -keyout ca-key.pem -out ca-cert.pem -subj "/C=CN/ST=ShanDong/L=QingDao/O=company/OU=demo/CN=koston/emailAddress=koston.zhuang@demo.com"

# 2. Generate web server's private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 -nodes -keyout server-key.pem -out server-req.pem -subj "/C=CN/ST=ShanDong/L=QingDao/O=company/OU=demo/CN=koston/emailAddress=koston.zhuang@demo.com"

# 3. Use CA's private key to sign web server's CSR and get back the signed certificate
openssl x509 -req -in server-req.pem -days 60 -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile server-ext.cnf

# 4. Generate client's private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 -nodes -keyout client-key.pem -out client-req.pem -subj "/C=CN/ST=ShanDong/L=QingDao/O=company/OU=demo/CN=koston/emailAddress=koston.zhuang@demo.com"

# 5. Use CA's private key to sign client's CSR and get back the signed certificate
openssl x509 -req -in client-req.pem -days 60 -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out client-cert.pem -extfile client-ext.cnf
```

## 服务端认证

修改服务端启动函数：

```go
func loadTLSCredentials() (credentials.TransportCredentials, error) {
	serverCert, err := tls.LoadX509KeyPair("ssl/server-cert.pem", "ssl/server-key.pem")
	if err != nil {
		return nil, err
	}
	config := &tls.Config{
		Certificates: []tls.Certificate{serverCert},
		ClientAuth: tls.NoClientCert,
	}
	return credentials.NewTLS(config), nil
}
// main 函数中
tlsCredentials, err := loadTLSCredentials()
if err != nil {
	log.Fatalln("cannot load TLS credentials:", err)
}
grpcServer := grpc.NewServer(
	grpc.Creds(tlsCredentials),
	grpc.UnaryInterceptor(authInterceptor.Unary()),
	grpc.StreamInterceptor(authInterceptor.Stream()),
)
```

修改客户端启动函数：

```go
func loadTLSCredentials() (credentials.TransportCredentials, error) {
	pemServerCA, err := ioutil.ReadFile("ssl/ca-cert.pem")
	if err != nil {
		return nil, err
	}
	certPool := x509.NewCertPool()
	if !certPool.AppendCertsFromPEM(pemServerCA) {
		return nil, fmt.Errorf("failed to add server CA's certificate")
	}
	config := &tls.Config{
		RootCAs: certPool,
	}
	return credentials.NewTLS(config), nil
}
tlsCredentials, err := loadTLSCredentials()
if err != nil {
	log.Fatalln("cannot load TLS credentials:", err)
}
conn, err := grpc.Dial(*serverAddress, grpc.WithTransportCredentials(tlsCredentials))
```

## 双端认证

修改服务端启动函数：

```go
func loadTLSCredentials() (credentials.TransportCredentials, error) {
	serverCert, err := tls.LoadX509KeyPair("ssl/server-cert.pem", "ssl/server-key.pem")
	if err != nil {
		return nil, err
	}
  // 这里添加 CA 相关。
	pemClientCA, err := ioutil.ReadFile("ssl/ca-cert.pem")
	if err != nil {
		return nil, err
	}
	certPool := x509.NewCertPool()
	if !certPool.AppendCertsFromPEM(pemClientCA) {
		return nil, fmt.Errorf("failed to add client CA's certificate")
	}
	config := &tls.Config{
    // 结构体内成员修改。
		Certificates: []tls.Certificate{serverCert},
		ClientAuth: tls.RequireAndVerifyClientCert,
		ClientCAs: certPool,
	}
	return credentials.NewTLS(config), nil
}
```

修改客户端启动函数：

```go
func loadTLSCredentials() (credentials.TransportCredentials, error) {
	pemServerCA, err := ioutil.ReadFile("ssl/ca-cert.pem")
	if err != nil {
		return nil, err
	}
	certPool := x509.NewCertPool()
	if !certPool.AppendCertsFromPEM(pemServerCA) {
		return nil, fmt.Errorf("failed to add server CA's certificate")
	}
  // 修改，添加客户端证书、密钥。
	clientCert, err := tls.LoadX509KeyPair("ssl/client-cert.pem", "ssl/client-key.pem")
	if err != nil {
		return nil, err
	}
	config := &tls.Config{
    // 修改
		Certificates: []tls.Certificate{clientCert},
		RootCAs: certPool,
	}
	return credentials.NewTLS(config), nil
}
```
