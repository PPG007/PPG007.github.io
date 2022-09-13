# RTC

[Reference](https://itsfoss.com/wrong-time-dual-boot/).

如果电脑是 Windows 和 Linux 双系统，那么可能出现 Linux 上时间正确，Windows 上时间错误或者相反的情况。

计算机中有两个时钟：系统时钟和硬件时钟（RTC, real time clock），系统时钟即操作系统的时钟，硬件时钟是主板上的时钟，关机后仍然运行。当系统开机时，硬件时钟被被读取并被用来设置系统时钟，之后，系统时钟用来跟踪时间，如果操作系统修改了系统时钟，则它也会尝试把变更同步到硬件时钟上。默认情况下，Linux 将硬件时钟认为是 UTC 时间，Windows 认为这是当地时间，这就是最终原因。

解决方法：

- 将 Windows 和 Ubuntu 都设置为从网络同步时间。
- 让 Linux 将硬件时钟解释为本地时间，`timedatectl set-local-rtc 1`，使用 `timedatectl` 检查确认。
- 让 Windows 将硬件时钟解释为 UTC 时间。
