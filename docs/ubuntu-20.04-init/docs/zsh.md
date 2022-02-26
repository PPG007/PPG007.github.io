# zsh&oh-my-zsh&terminator

install zsh:

```shell
# install zsh
sudo apt-get install zsh
# set zsh default shell,then logout
chsh -s /usr/bin/zsh
# install curl
sudo apt install curl
# or install wget to get oh-my-zsh
sudo apt install wget
# install oh-my-zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# or
sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

install terminator:

```shell
# install terminator
sudo add-apt-repository ppa:mattrose/terminator
sudo apt-get update
sudo apt install terminator
# set terminator default
gsettings set org.gnome.desktop.default-applications.terminal exec /usr/bin/terminator
gsettings set org.gnome.desktop.default-applications.terminal exec-arg "-x"
# maybe need this
gsettings set org.cinnamon.desktop.default-applications.terminal exec /usr/bin/terminator
```

install zsh plugins:

```shell
# install zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# install autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# install git-open
git clone https://github.com/paulirish/git-open.git $ZSH_CUSTOM/plugins/git-open
# then vim ~/.zshrc
plugins=(git sudo zsh-syntax-highlighting zsh-autosuggestions colored-man-pages safe-paste git-open)
# then
source ~/.zshrc
```
