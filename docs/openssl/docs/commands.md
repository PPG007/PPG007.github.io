# OpenSSL 命令

## genrsa

genrsa 用于生成 RSA 私钥，不会生成公钥，因为公钥提取自私钥，如果要查看公钥或者生成公钥可以使用 `openssl rsa` 命令。

`openssl genrsa [-out filename] [-passout arg] [-des] [-des3] [-idea] [numbits]`：

- `-out filename`：将私钥输出到指定的文件，如果不指定此参数会输出到标准输出。
- `passout arg`：加密私钥文件时传递密码的格式，如果要加密私钥文件时没有指定此参数则提示输入密码。

    密码格式：

    - 格式一：`pass:password`，password 表示传递的明文密码。
    - 格式二：`env:var`，从环境变量 var 获取密码。
    - 格式三：`file:filename`，filename 文件中的第一行作为密码，如果同时使用此格式传递给 passin 和 passout 选项，则第一行是 passin，第二行是 passout。
    - 格式三：`stdin`：从标准输入中获取要传递的密码。

- `numbits`：指定要生成的私钥的长度，默认为 1024，该项必须是命令行的最后一项参数。
- `-des|-des3|-idea`：指定加密私钥文件用的算法，这样每次使用私钥文件都将输入密码。

使用下面的命令生成一个不加密的私钥并输出到文件 private.key：

```shell
openssl genrsa -out private.key
```

生成一个加密的私钥文件并输出到 private-secret.key 文件中：

```shell
openssl genrsa -out private-secret.key -passout pass:test
```

## rsa/pkey

openssl rsa 和 openssl pkey 分别是 RSA 密钥的处理工具和通用非对称密钥处理工具，它们用法基本一致。

`openssl rsa [-in filename] [-passin arg] [-passout arg] [-out filename] [-des|-des3|-idea] [-text] [-noout] [-pubin] [-pubout] [-check]`

- `-in filename` ：指定密钥输入文件。默认读取的是私钥，若指定 -pubin 选项将表示读取公钥。将从该文件读取密钥，不指定时将从stdin 读取。
- `-out filename`：指定密钥输出文件。默认输出私钥，若指定 -pubin 或 -pubout 选项都将输出公钥。不指定将输出到 stdout。
- `-pubin`：指定该选项时，将显式表明从 -in filename 的 filename 中读取公钥，所以 filename 必须为公钥文件。不指定该选项时，默认是从filename中读取私钥。
- `-pubout`：指定该选项时，将显示表明从 -in filename 的 filename 中提取公钥并输出，所以 filename 文件必须是私钥文件。不指定该选项时，默认输出私钥。当设置了 -pubin 时，默认也设置了 -pubout。
- `-noout` ：控制不输出任何密钥信息。
- `-text`  ：转换输入和输出的密钥文件格式为纯文本格式。
- `-check` ：检查 RSA 密钥是否完整未被修改过，只能检测私钥，因为公钥来源于私钥。因此选项 `-in filename` 的 filename 文件只能是私钥文件。
- `-des|-des3|-idea`：加密输出文件，使得每次读取输出文件时都需要提供密码。
- `-passin arg` ：传递解密密钥文件的密码。密码格式见 openssl 密码格式。
- `-passout arg`：指定加密输出文件的密码。

`openssl pkey [-passin arg] [-passout arg] [-in filename] [-out filename] [-cipher] [-text] [-noout] [-pubin] [-pubout]`

- `-cipher`：等价于 openssl rsa 的 `-des|-des3|-idea`，例如 `-cipher des3`。

将上面生成的未加密的私钥对应的公钥提取到 public.key 文件中：

```shell
openssl rsa -in private.key -pubout -out public.key
```

将上面生成的加密的私钥的公钥提取到 public-secret.key 文件中：

```shell
openssl rsa -in private-secret.key -passin pass:test -pubout -out public-secret.key
```

解除加密的公私钥文件：

```shell
openssl rsa -in private-secret.key -passin pass:test -out private-withoutsecr
et.key
```

直接读取输出即可。

检查私钥文件是否被修改过：

```shell
openssl rsa -in private.key -check
```

## 使用成对的公私钥加密解密文件

由于 Go 的官方库中 RSA 只支持公钥加密私钥解密，所以这里我们借助一个开源库：

```shell
go get github.com/farmerx/gorsa
```

然后使用下面的代码进行公私钥加密解密：

```go
package main

import (
	"errors"
	"fmt"
	"github.com/farmerx/gorsa"
	"io/ioutil"
	"os"
)

type Type string

const (
	public  Type = "public"
	private Type = "private"
)

var (
	privateKey string
	publicKey  string
)

func loadKeyFromFile(fileName string) ([]byte, error) {
	return ioutil.ReadFile(fileName)
}

func init() {
	privateKey, err := loadKeyFromFile("private.key")
	if err != nil {
		panic(err)
	}
	publicKey, err := loadKeyFromFile("public.key")
	if err != nil {
		panic(err)
	}
	err = gorsa.RSA.SetPrivateKey(string(privateKey))
	if err != nil {
		panic(err)
	}
	err = gorsa.RSA.SetPublicKey(string(publicKey))
	if err != nil {
		panic(err)
	}
}

func main() {
	stringDate, err := ioutil.ReadFile("source.yaml")
	if err != nil {
		panic(err)
	}
	bytesDate, err := ioutil.ReadFile("source.mkv")
	if err != nil {
		panic(err)
	}
	pubEncryptPriDecryptTest(stringDate, "string")
	priEncryptPubDecryptTest(stringDate, "string")
	pubEncryptPriDecryptTest(bytesDate, "bytes")
	priEncryptPubDecryptTest(bytesDate, "bytes")
}

func encrypt(source []byte, keyType Type) ([]byte, error) {
	if keyType == public {
		return gorsa.RSA.PubKeyENCTYPT(source)
	} else if keyType == private {
		return gorsa.RSA.PriKeyENCTYPT(source)
	} else {
		return nil, errors.New("not supported key type")
	}
}

func decrypt(data []byte, keyType Type) ([]byte, error) {
	if keyType == public {
		return gorsa.RSA.PubKeyDECRYPT(data)
	} else if keyType == private {
		return gorsa.RSA.PriKeyDECRYPT(data)
	} else {
		return nil, errors.New("not supported key type")
	}
}

func pubEncryptPriDecryptTest(source []byte, filePrefix string) {
	file, err := os.Create(fmt.Sprintf("%s-publicEncrypt", filePrefix))
	if err != nil {
		return
	}
	defer file.Close()
	fmt.Println("start pubEncrypt")
	encrypted, err := encrypt(source, public)
	if err != nil {
		return
	}
	fmt.Println("pubEncrypt over")
	_, err = file.Write(encrypted)
	if err != nil {
		return
	}
	fmt.Println("start priDecrypt")
	decrypted, err := decrypt(encrypted, private)
	fmt.Println("priDecrypt over")
	if err != nil {
		return
	}
	decryptedFile, err := os.Create(fmt.Sprintf("%s-privateDecrypt", filePrefix))
	if err != nil {
		return
	}
	defer decryptedFile.Close()
	_, err = decryptedFile.Write(decrypted)
	if err != nil {
		return
	}
}

func priEncryptPubDecryptTest(source []byte, filePrefix string) {
	file, err := os.Create(fmt.Sprintf("%s-privateEncrypt", filePrefix))
	if err != nil {
		return
	}
	defer file.Close()
	fmt.Println("start priEncrypt")
	encrypted, err := encrypt(source, private)
	if err != nil {
		return
	}
	fmt.Println("priEncrypt over")
	_, err = file.Write(encrypted)
	if err != nil {
		return
	}
	fmt.Println("start pubDecrypt")
	decrypted, err := decrypt(encrypted, public)
	fmt.Println("pubDecrypt over")
	if err != nil {
		return
	}
	decryptedFile, err := os.Create(fmt.Sprintf("%s-publicDecrypt", filePrefix))
	if err != nil {
		return
	}
	defer decryptedFile.Close()
	_, err = decryptedFile.Write(decrypted)
	if err != nil {
		return
	}
}
```

上面这段代码分别对两个文件进行了加解密操作，分别使用公钥加密私钥解密以及私钥加密公钥解密。

## openssl dgst 生成和验证数字签名

数字签名的过程是计算出数字摘要，然后使用私钥对数字摘要进行签名，而摘要是使用 md5、sha512 等算法计算得出的。

`openssl dgst [-md5|-sha1|...] [-hex | -binary] [-out filename] [-sign filename] [-passin arg] [-verify filename] [-prverify filename] [-signature filename] [file...]`：

- `file...`：指定待签名的文件。
- `-hex`：以 hex 格式输出数字摘要。如果不以 `-hex` 显示，签名或验证签名时很可能乱码。
- `-binary`：以二进制格式输出数字摘要，或以二进制格式进行数字签名。这是默认格式。
- `-out filename`：指定输出文件，若不指定则输出到标准输出。
- `-sign filename`：使用 filename 中的私钥对 file 数字签名。签名时绝对不能加 `-hex` 等格式的选项，否则验证签名必失败。
- `-signature filename`：指定待验证的签名文件。
- `-verify filename`：使用 filename 中的公钥验证签名。
- `-prverify filename`：使用 filename 中的私钥验证签名。
- `-passin arg`：传递解密密码。若验证签名时实用的公钥或私钥文件是被加密过的，则需要传递密码来解密。

支持 md4、md5、ripemd160、sha、sha1、sha224、sha256、sha384、sha512、whirlpool 这几种单向加密算法，即哈希算法。

::: tip
`openssl dgst -md5` 等价于 `openssl md5`。
:::

对 source.yaml 生成 md5 摘要信息及 sha512 摘要信息：

```shell
openssl dgst -md5 -out dgst.out source.yaml

openssl dgst -sha512 -out dgst.out source.yaml
```

使用一个加密过的私钥对 source.yaml 文件签名：

```shell
# 加入 -hex 参数防止输出乱码
openssl dgst -sha256 -sign private-secret.key -passin pass:123456 -out dgst.out -hex source.yaml
```

验证签名，注意要将签名输出到文件且不能使用 -hex 参数：

```shell
# 先生成新签名
openssl dgst -sha256 -sign private-secret.key -passin pass:123456 -out dgst.out source.yaml
# 私钥验证
openssl dgst -sha256 -prverify private-secret.key -passin pass:123456 -signature dgst.out source.yaml
# 公钥验证
openssl dgst -sha256 -verify public-secret.key -passin pass:123456 -signature dgst.out source.yaml
```

## openssl rsautl 和 pkeyutl

rsautl 是 rsa 的工具，相当于 rsa、dgst 的部分功能集合，可用于生成数字签名、验证数字签名、加密和解密文件。

pkeyutl 是非对称加密的通用工具。

`openssl rsautl [-in file] [-out file] [-inkey file] [-pubin] [-certin] [-passin arg] [-sign] [-verify] [-encrypt] [-decrypt] [-hexdump]`

`openssl pkeyutl [-in file] [-out file] [-sigfile file] [-inkey file] [-passin arg] [-pubin] [-certin] [-sign] [-verify] [-encrypt] [-decrypt] [-hexdump]`

- `-in file`：指定输入文件。
- `-out file`：指定输出文件。
- `-inkey file`：指定密钥输入文件，默认是私钥文件，指定了 -pubin 则表示为公钥文件，使用 -certin 则表示为包含公钥的证书文件。
- `-pubin`：指定 -inkey file 的 file 是公钥文件。
- `-certin`：使用该选项时，表示 -inkey file 的 file 是包含公钥的证书文件。
- `-passin arg`：传递解密密码。若验证签名时实用的公钥或私钥文件是被加密过的，则需要传递密码来解密。
- `-sign`：签名并输出签名结果，注意，该选项需要提供RSA私钥文件。
- `-verify`：使用验证签名文件。
- `-encrypt`：使用公钥加密文件。
- `-decrypt`：使用私钥解密文件。
- `-hexdump`：以 hex 方式输出。
- `sigfile file`：待验证的签名文件。

::: warning
rsautl 和 pkeyutl 的缺陷在于默认只能对短小的文件进行操作。
:::

公钥加密、私钥解密：

```shell
# 加密
openssl rsautl -encrypt -inkey public.key -pubin -in source.yaml -out rsautl.yaml
# 解密
openssl rsautl --decrypt -inkey private.key -in rsautl.yaml -out rsautldec.yaml
```

## openssl enc

openssl enc 是对称加密工具。

`openssl enc -ciphername [-in filename] [-out filename] [-pass arg] [-e] [-d] [-a/-base64] [-k password] [-S salt] [-salt] [-md] [-p/-P]`

- `-ciphername`：指定对称加密算法(如 des3)，可独立于 enc 直接使用，如 openssl des3 或 openssl enc -des3。推荐在 enc 后使用，这样不依赖于硬件。
- `-in filename`：输入文件，不指定时默认是 stdin。
- `-out filename`：输出文件，不指定时默认是 stdout。
- `-e`：对输入文件加密操作，不指定时默认就是该选项。
- `-d`：对输入文件解密操作，只有显示指定该选项才是解密。
- `-pass`：传递加、解密时的明文密码。若验证签名时实用的公钥或私钥文件是被加密过的，则需要传递密码来解密。
- `-k`：已被 -pass 替代，现在还保留是为了兼容老版本的 openssl。
- `-base64`：在加密后和解密前进行 base64 编码或解码，不指定时默认是二进制。
- `-a`：等价于 -base64。
- `-salt`：单向加密时使用 salt 复杂化单向加密的结果，此为默认选项，且使用随机 salt 值。
- `-S salt`：不使用随机 salt 值，而是自定义 salt 值，但只能是 16 进制范围内字符的组合，即 0-9a-fA-F 的任意一个或多个组合。
- `-p`：打印加解密时 salt 值、key 值和 IV 初始化向量值（也是复杂化加密的一种方式），解密时还输出解密结果，见后文示例。
- `-P`：和 -p 选项作用相同，但是打印时直接退出工具，不进行加密或解密操作。
- `-md`：指定单向加密算法，默认 md5。该算法是拿来加密 key 部分的，见后文分析。

进行对称加解密时，加密和解密的密码是一致的，但是如果使用明文密码非常不安全，需要增加密码的复杂度。最简单的方法就是使用哈希函数计算出明文密码的哈希值，将这个哈希值作为对称密钥。如果还想更安全可以在加密完成后再进行 base64 等编码。

::: tip 对称加密机制
根据指定的哈希算法，对输入的明文密码进行单向加密，得到固定长度的加密密钥，即对称密钥，，再根据指定的对称加密算法进行加密，最后对加密的文件进行编码。
:::

::: tip 对称解密机制
先解码文件，然后根据同样的哈希算法计算密钥，然后使用对应的对称算法进行解密。
:::

对一个视频文件进行加密解密：

```shell
# 加密
openssl enc -aes256 -in source.mkv -e -pass pass:123456 -a -md sha256 -out enc.out
# 解密
openssl enc -aes256 -in enc.out -out enc.mkv -d -md sha256 -pass pass:zzl -a
```
