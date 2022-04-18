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

## 签署和自建 CA

证书请求文件使用 CA 的私钥签署之后就是证书，签署之后将证书发给申请者就是颁发证书。在签署时，为了保证证书的完整性和一致性，还应该对签署的证书生成数字摘要，即使用单向加密算法。

自建 CA 依赖 OpenSSL 的配置文件，这里我们使用默认的配置文件，Ubuntu 环境中在 /etc/ssl/openssl.cnf。

我们将这个 openssl.cnf 拷贝一份，根据自己的情况修改这个文件中间的 CA_default 中的 dir 属性为自己的目录，然后需要在这个目录中创建 certs、newcerts、private 三个文件夹，然后在当前目录中创建 serial 文件并在其中输入 01 作为序号，并创建一个空的 index.txt 文件，然后先使用下面的命令生成一个 CA 的私钥：

```shell
openssl genrsa -out private/cakey.pem
```

### 自建 CA

首先创建 CA 的证书请求文件：

```shell
openssl req -new -key private/cakey.pem -out rootCA.csr
```

然后使用 `openssl ca` 命令自签署该证书请求文件：

```shell
openssl ca -selfsign -in rootCA.csr -config openssl.cnf
```

如果有两次询问则表示自签署成功，此时在 newcerts 目录中的 01.pem 就是刚刚自签署的证书文件，因为这个是 CA 自身的证书，所以根据配置文件中的 certificate 属性移动到当前目录中并重命名为 cacert.pem。

### 签署证书

首先申请者创建一个证书请求文件：

```shell
# 生成密钥
openssl genrsa -out pri_key.pem
# 创建请求
openssl req -new -key pri_key.pem -out localhost.crt
```

::: warning
注意生成请求时，根据配置文件中的 [policy_match] 模块中的配置，match 表示请求中的这个字段和 CA 的这个字段必须相同，supplied 表示必须要提供的项，optional 表示可选项，所以可以留空。

```cnf
[ policy_match ]
countryName		= match
stateOrProvinceName	= match
organizationName	= match
organizationalUnitName	= optional
commonName		= supplied
emailAddress		= optional
```

:::

最后执行下面的命令签署：

```shell
openssl ca -in localhost.crt -config openssl.cnf
```

这时会在 newcerts 目录中生成 02.pem 文件，这就是签署成功的证书。

然后使用下面的程序可以测试 HTTPS 连接：

```go
package main

import "net/http"

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		w.Write([]byte("Hello"))
	})
	http.ListenAndServeTLS("0.0.0.0:8080", "02.pem", "pri_key.pem", nil)
}
```

## openssl x509 签署和自签署

openssl x509 工具不会使用 openssl 配置文件中的设定，而是完全需要自行设定或者使用该伪命令的默认值，它就像是一个完整的小型的CA工具箱。

`openssl x509 [-in filename] [-out filename] [-serial] [-hash] [-subject_hash] [-issuer_hash] [-subject] [-issuer][-nameopt option] [-email] [-startdate] [-enddate] [-purpose] [-dates] [-modulus] [-pubkey] [-fingerprint] [-noout][-days arg] [-set_serial n] [-signkey filename] [-x509toreq] [-req] [-CA filename] [-CAkey filename] [-CAcreateserial][-CAserial filename] [-text] [-md2|-md5|-sha1|-mdc2] [-extfile filename] [-extensions section]`

- `-in filename`：指定证书输入文件，若同时指定了 -req 选项，则表示输入文件为证书请求文件。
- `-out filename`：指定输出文件。
- `-md2|-md5|-sha1|-mdc2`：指定单向加密的算法。
- `-text`：以 text 格式输出证书内容，即以最全格式输出，包括 public key,signature algorithms,issuer 和 subject names,serial number 以及 any trust settings。
- `-certopt option`：自定义要输出的项。
- `-noout`：禁止输出证书请求文件中的编码部分。
- `-pubkey`：输出证书中的公钥。
- `-modulus`：输出证书中公钥模块部分。
- `-serial`：输出证书的序列号。
- `-subject`：输出证书中的 subject。
- `-issuer`：输出证书中的 issuer，即颁发者的 subject。
- `-subject_hash`：输出证书中 subject 的 hash 码。
- `-issuer_hash`：输出证书中 issuer(即颁发者的 subject)的 hash 码。
- `-hash`：等价于 -subject_hash，但此项是为了向后兼容才提供的选项。
- `-email`：输出证书中的 email 地址，如果有 email 的话。
- `-startdate`：输出证书有效期的起始日期。
- `-enddate`：输出证书有效期的终止日期。
- `-dates`：输出证书有效期，等价于 startdate+enddate。
- `-fingerprint`：输出指纹摘要信息。
 `-signkey filename`：该选项用于提供自签署时的私钥文件，自签署的输入文件 -in file 的 file 可以是证书请求文件，也可以是已签署过的证书。
- `-days arg`：指定证书有效期限，默认 30 天。
- `-x509toreq`：将已签署的证书转换回证书请求文件。需要使用 -signkey 选项来传递需要的私钥。
- `-req`：x509 工具默认以证书文件做为 inputfile(-in file)，指定该选项将使得 input file 的 file 为证书请求文件。
- `-set_serial n`：指定证书序列号。该选项可以和 -singkey 或 -CA 选项一起使用。如果和 -CA 一起使用，则 -CAserial 或 -CAcreateserial 选项指定的 serial 值将失效。
- `-CA filename`：指定签署时所使用的 CA 证书。该选项一般和 -req 选项一起使用，用于为证书请求文件签署。
- `-CAkey filename`：设置 CA 签署时使用的私钥文件。如果该选项没有指定，将假定 CA 私钥已经存在于 CA 自签名的证书文件中。
- `-CAserial filename`：设置 CA 使用的序列号文件。当使用 -CA 选项来签名时，它将会使用某个文件中指定的序列号来唯一标识此次签名后的证书文件。这个序列号文件的内容仅只有一行，这一行的值为 16 进制的数字。当某个序列号被使用后，该文件中的序列号将自动增加。默认序列号文件以 CA 证书文件基名加 .srl 为后缀命名。如 CA 证书为 mycert.pem，则默认寻找的序列号文件为 mycert.srl。
- `-CAcreateserial`：当使用该选项时，如果 CA 使用的序列号文件不存在将自动创建：该文件将包含序列号值 02 并且此次签名后证书文件序列号为 1。一般如果使用了 -CA 选项而序列号文件不存在将会产生错误"找不到 srl 文件"。
- `-extfile filename` ：指定签名时包含要添加到证书中的扩展项的文件。
- `-purpose`：选项检查证书的扩展项并决定该证书允许用于哪些方面，即证书使用目的范围。
- `basicConstraints`：该扩展项用于决定证书是否可以当作 CA 证书。格式为 basicConstraints=CA:true。
    - 如果 CA 的 flag 设置为 true，那么该证书允许作为一个 CA 证书，即可以颁发下级证书或进行签名。
    - 如果 CA 的 flag 设置为 false，那么该证书就不能作为 CA，不能为下级颁发证书或签名。
    - 所有 CA 的证书中都必须设置 CA 的 flag 为 true。
    - 如果basicConstraints扩展项未设置，那么证书被认为可疑的CA，即"possible CA"。
- `keyUsage`：该扩展项用于指定证书额外的使用限制，即也是使用目的的一种表现方式。如果 keyUsage 扩展项被指定，那么该证书将又有额外的使用限制。CA 证书文件中必须至少设置 keyUsage=keyCertSign。如果设置了 keyUsage 扩展项，那么不论是否使用了 critical，都将被限制在指定的使用目的 purpose 上。

下面使用 openssl req 命令生成一个请求文件然后使用 x509 签署：

```shell
# 首先生成私钥
openssl genrsa -out cakey.pem
# 创建请求文件
openssl req -new -key cakey.pem -out rootCA.csr
# 自签署
openssl x509 -req -in rootCA.csr -signkey cakey.pem -out x509.crt
```

下面为其他人签署证书请求：

```shell
# 首先生成私钥
openssl genrsa -out prikey.pem
# 创建请求文件
openssl req -new -key prikey.pem -out local.csr
# 签署证书请求
openssl x509 -req -in local.csr -CA x509.crt -CAkey cakey.pem -out localhost.crt -CAcreateserial
```
