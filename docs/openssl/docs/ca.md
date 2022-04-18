# 证书请求、颁发、CA 相关

## openssl req

req 命令大致有 3 个功能：生成证书请求文件、验证证书请求文件和创建根 CA。

生成证书请求需要什么：申请者需要将自己的信息及其公钥放入证书请求中。但在实际操作过程中，所需要提供的是私钥而非公钥，因为它会自动从私钥中提取公钥。另外，还需要将提供的数据进行数字签名(使用单向加密)，保证该证书请求文件的完整性和一致性，防止他人盗取后进行篡改，例如黑客将为 www.baidu.com 所申请的证书请求文件中的公司名改成对方的公司名称，如果能够篡改成功，则签署该证书请求时，所颁发的证书信息中将变成他人信息。

首先生成私钥：

```shell
openssl genrsa -out private.pem
```

根据私钥生成一个新的证书请求文件，`-new` 表示新生成一个新的证书请求文件，`-key` 指定私钥文件，`-out` 指定输出文件，此处输出的文件即为证书请求文件：

```shell
openssl req -new -key private.pem -out req1.csr
```

执行此命令后依次填入需要的信息即可。

查看请求文件的内容：

```shell
openssl req -in req1.csr -text -noout
# 查看公钥
openssl req -in req1.csr -pubkey
```

指定证书请求文件的签名算法：

```shell
openssl req -new -key private.pem -out req2.csr -sha256
```

验证请求文件的数字签名,这样可以验证出证书请求文件是否被篡改过。下面的命令中 -verify 选项表示验证证书请求文件的数字签名：

```shell
openssl req -verify -in req1.csr
```

自签署证书，可用于自建根 CA，使用openssl req自签署证书时，需要使用"-x509"选项，由于是签署证书请求文件，所以可以指定"-days"指定所颁发的证书有效期：

```shell
openssl req -x509 -key private.pem -in req1.csr -out ca1.crt -days 365
```

-x509 选项和 -new 或 -newkey 配合使用时，可以不指定证书请求文件，它在自签署过程中将在内存中自动创建证书请求文件，当然，既然要创建证书请求文件，就需要人为输入申请者的信息了。

让 openssl req 自动创建所需的私钥文件：

在前面的所有例子中，在需要私钥的时候都明确使用了 -key 选项提供私钥。其实如果不提供，openssl req 会在任何需要私钥的地方自动创建私钥，并保存在特定的位置，默认的保存位置为当前目录，文件名为 privkey.pem，具体保存的位置和文件名由配置文件(默认为 /etc/pki/tls/openssl.cnf)决定，-keyout 选项可以指定私钥保存位置：

```shell
openssl req -new -out req3.csr -keyout private2.pem
```

::: tip
自动创建私钥时，将总是加密该文件，并提示输入密码，可以通过增加 `-nodes` 选项禁止加密私钥文件。
:::

`openssl req [-new] [-newkey rsa:bits] [-verify] [-x509] [-in filename] [-out filename] [-key filename] [-passin arg] [-passout arg] [-keyout filename] [-pubkey] [-nodes] [-[dgst]] [-config filename] [-subj arg] [-days n] [-set_serial n] [-extensions section] [-reqexts section] [-utf8] [-nameopt] [-reqopt] [-subject] [-subj arg] [-text] [-noout] [-batch] [-verbose]`

- `-new`：创建一个证书请求文件，会交互式提醒输入一些信息，这些交互选项以及交互选项信息的长度值以及其他一些扩展属性在配置文件(默认为 openssl.cnf，还有些辅助配置文件)中指定了默认值。如果没有指定 -key 选项，则会自动生成一个 RSA 私钥，该私钥的生成位置也在 openssl.cnf 中指定了。如果指定了-x509 选项，则表示创建的是自签署证书文件，而非证书请求文件。
- `-newkey args`：类似于 -new 选项，创建一个新的证书请求，并创建私钥。
- `-nodes`：默认情况下，openssl req 自动创建私钥时都要求加密并提示输入加密密码，指定该选项后则禁止对私钥文件加密。
- `-key filename`：指定私钥的输入文件，创建证书请求时需要。
- `-keyout filename`：指定自动创建私钥时私钥的存放位置，若未指定该选项，则使用配置文件中 default_keyfile 指定的值，默认该值为 privkey.pem。
- `-[dgst]`：指定对创建请求时提供的申请者信息进行数字签名时的单向加密算法，如 -md5、-sha1、-sha512 等，若未指定则默认使用配置文件中 default_md 指定的值。
- `-verify`：对证书请求文件进行数字签名验证。
- `-x509`：指定该选项时，将生成一个自签署证书，而不是创建证书请求。一般用于测试或者为根 CA 创建自签名证书。
- `-days n`：指定自签名证书的有效期限，默认 30 天，需要和 -x509 一起使用。
- `-set_serial n`：指定生成自签名证书时的证书序列号，该序列号将写入配置文件中 serial 指定的文件中，这样就不需要手动更新该序列号文件。
- `-in filename`：指定证书请求文件filename。注意，创建证书请求文件时是不需要指定该选项的
- `-out filename`：证书请求或自签署证书的输出文件，也可以是其他内容的输出文件，不指定时默认stdout
- `-subj args`：替换或自定义证书请求时需要输入的信息，并输出修改后的请求信息。
- `-text`：以文本格式打印证书请求。
- `-noout`：不输出部分信息。
- `-subject`：输出证书请求文件中的 subject(如果指定了 x509，则打印证书中的 subject)。
- `-pubkey`：输出证书请求文件中的公钥。
- `-passin arg`：传递解密密码。
- `-passout arg`：指定加密输出文件时的密码。
- `-config filename`：指定 req 的配置文件，指定后将忽略所有的其他配置文件。如果不指定则默认使用 /etc/pki/tls/openssl.cnf 中req段落的值。
- `-batch`：非交互模式，直接从配置文件(默认 /etc/pki/tls/openssl.cnf)中读取证书请求所需字段信息。但若不指定 -key 时，仍会询问 key。
- `-verbose`：显示操作执行的详细信息。
