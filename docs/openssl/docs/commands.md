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
