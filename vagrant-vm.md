{{DISPLAYTITLE:Create a DSP VM using Vagrant}}

From the [http://vagrantup.com Vagrant] web site:

<blockquote>
<p>Vagrant is a tool for building complete development environments. With an easy-to-use workflow and focus on automation, Vagrant lowers development environment setup time, increases development/production parity, and makes the "works on my machine" excuse a relic of the past.</p>
<p>Vagrant was started in January 2010 by Mitchell Hashimoto. For almost three years, Vagrant was a side-project for Mitchell, a project that he worked on in his free hours after his full time job. During this time, Vagrant grew to be trusted and used by a range of individuals to entire development teams in large companies.</p>
<p>In November 2012, HashiCorp was formed by Mitchell to back the development of Vagrant full time. HashiCorp builds commercial additions and provides professional support and training for Vagrant.</p>
<p>Vagrant remains and always will be a liberally licensed open source project. Each release of Vagrant is the work of hundreds of individuals' contributions to the open source project.</p>
</blockquote>

== Installation and Setup ==

Installing and setting up [http://vagrantup.com vagrant] is beyond the scope of this guide. However, excellent resources are available on the [http://vagrantup.com Vagrant] web site as well as the [http://google.com/ Google].

You are free to choose the distribution of your preference. Once set up, this guide will diverge to the appropriate package installation guide a little further down.

== Choosing a Distribution ==

The examples on the vagrant web site use Ubuntu 12.04 LTS mostly, however you're free to choose any operating system that has a Vagrant Box available. You can even make your own.  A list of public Vagrant boxes is available at [http://vagrantbox.es/ VagrantBox.es]

== Creating Your VM ==

If you have already created your Vagrant box, you can skip this section entirely.

== CentOS ==

=== Create the VM ===

This step creates a new VM and downloads the box from Puppet Labs.

First off create a new directory to house your vagrant configuration information:

<syntaxhighlight lang="bash">
sandman@dreamfactory$ mkdir centos6
sandman@dreamfactory$ cd centos6
</syntaxhighlight>

Now tell vagrant to initialize:

<syntaxhighlight lang="bash">
sandman@dreamfactory$ vagrant init centos6_dsp http://puppet-vagrant-boxes.puppetlabs.com/centos-64-x64-vbox4210-nocm.box
A `Vagrantfile` has been placed in this directory. You are now
ready to `vagrant up` your first virtual environment! Please read
the comments in the Vagrantfile as well as documentation on
`vagrantup.com` for more information on using Vagrant.
</syntaxhighlight>

This will create a file called '''Vagrantfile'''.

We need to make one change to this file. It will tell vagrant to automatically set up a port forward to your DSP.

With the text editor of your choice, edit this file and search for the the following text:

<syntaxhighlight lang="ruby">
   # Create a forwarded port mapping which allows access to a specific port
   # within the machine from a port on the host machine. In the example below,
   # accessing "localhost:8080" will access port 80 on the guest machine.
   # config.vm.network :forwarded_port, guest: 80, host: 8080
</syntaxhighlight>

And uncomment the last line by removing the hash mark ('''#'''):

<syntaxhighlight lang="ruby">
   # Create a forwarded port mapping which allows access to a specific port
   # within the machine from a port on the host machine. In the example below,
   # accessing "localhost:8080" will access port 80 on the guest machine.
   config.vm.network :forwarded_port, guest: 80, host: 8080
</syntaxhighlight>

Save the changes and start up the VM:

<syntaxhighlight lang="bash">
sandman@dreamfactory$ vagrant up
Bringing machine 'default' up with 'virtualbox' provider...
[default] Box 'centos6_dsp' was not found. Fetching box from specified URL for
the provider 'virtualbox'. Note that if the URL does not have
a box for this provider, you should interrupt Vagrant now and add
the box yourself. Otherwise Vagrant will attempt to download the
full box prior to discovering this error.
Downloading or copying the box...
Extracting box...te: 2017k/s, Estimated time remaining: --:--:--)
Successfully added box 'centos6_dsp' with provider 'virtualbox'!
[default] Importing base box 'centos6_dsp'...
[default] Matching MAC address for NAT networking...
[default] Setting the name of the VM...
[default] Clearing any previously set forwarded ports...
[default] Creating shared folders metadata...
[default] Clearing any previously set network interfaces...
[default] Preparing network interfaces based on configuration...
[default] Forwarding ports...
[default] -- 22 => 2222 (adapter 1)
[default] -- 80 => 8080 (adapter 1)
[default] Booting VM...
[default] Waiting for VM to boot. This can take a few minutes.
[default] VM booted and ready for use!
[default] Configuring and enabling network interfaces...
[default] Mounting shared folders...
[default] -- /vagrant
</syntaxhighlight>

This creates a virtual machine based on the box that was just downloaded. SSH is available on port 2222 and a user named '''vagrant''' with a password of '''vagrant''' has been created that has sudo privileges.

Now connect to your new VM to make sure everything's cool:

<syntaxhighlight lang="bash">
sandman@dreamfactory$ vagrant ssh
Last login: Sun Apr 14 22:24:07 2013
Welcome to your Vagrant-built virtual machine.
[vagrant@localhost ~]$
</syntaxhighlight>

=== Configuring the VM ===

Now that the VM is created, we need to install the dependencies for the DSP package. These are detailed on the [[Packages/Rpm|RPM package installation guide]]. Please install and enable the EPEL repository, it'll look similar, if not exactly like, the following:

<syntaxhighlight lang="bash">
[vagrant@localhost ~]$ wget http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
--2013-06-17 18:00:49--  http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
Resolving dl.fedoraproject.org... 209.132.181.24, 209.132.181.25, 209.132.181.26, ...
Connecting to dl.fedoraproject.org|209.132.181.24|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 14540 (14K) [application/x-rpm]
Saving to: “epel-release-6-8.noarch.rpm”

100%[==============================================================================>] 14,540      --.-K/s   in 0.07s

2013-06-17 18:00:55 (191 KB/s) - “epel-release-6-8.noarch.rpm” saved [14540/14540]

[vagrant@localhost ~]$ wget http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
--2013-06-17 18:00:55--  http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
Resolving rpms.famillecollet.com... 88.191.74.232, 2a01:e0b:1:74:2e0:f4ff:fe1b:b827
Connecting to rpms.famillecollet.com|88.191.74.232|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 5420 (5.3K) [application/x-rpm]
Saving to: “remi-release-6.rpm”

100%[==============================================================================>] 5,420       --.-K/s   in 0.1s

2013-06-17 18:01:00 (44.5 KB/s) - “remi-release-6.rpm” saved [5420/5420]

[vagrant@localhost ~]$ sudo rpm -Uvh remi-release-6*.rpm epel-release-6*.rpm
warning: remi-release-6.rpm: Header V3 DSA/SHA1 Signature, key ID 00f97f56: NOKEY
warning: epel-release-6-8.noarch.rpm: Header V3 RSA/SHA256 Signature, key ID 0608b895: NOKEY
Preparing...                ########################################### [100%]
   1:epel-release           ########################################### [ 50%]
   2:remi-release           ########################################### [100%]
[
</syntaxhighlight>

This will add new '''.repo''' files to your /etc/yum.repos.d directory. In order to reap the benefits of installing these additional repositories, we need to enable them. This is done by changing the '''enabled''' setting in the '''.repo''' files from '''0''' to '''1'''.

The file uses a simple '''INI''' format. The sections we want to enable are '''remi''' in /etc/yum.repos.d/remi.repo, and '''epel''' in /etc/yum.repos.d/epel.repo.  Open and change the '''enabled''' setting to '''1''':

Before:

<syntaxhighlight lang="ini" title="remi.repo before">
[remi]
name=Les RPM de remi pour Enterprise Linux 6 - $basearch
#baseurl=http://rpms.famillecollet.com/enterprise/6/remi/$basearch/
mirrorlist=http://rpms.famillecollet.com/enterprise/6/remi/mirror
enabled=0
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-remi
</syntaxhighlight>

After:

<syntaxhighlight lang="ini" title="remi.repo after">
[remi]
name=Les RPM de remi pour Enterprise Linux 6 - $basearch
#baseurl=http://rpms.famillecollet.com/enterprise/6/remi/$basearch/
mirrorlist=http://rpms.famillecollet.com/enterprise/6/remi/mirror
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-remi
</syntaxhighlight>

Do the same for the EPEL repository file. You may find it enabled by default. Bonus!

<blockquote>
One major benefit of using the EPEL repositories is that your PHP installation will stay up-to-date with new releases. The standard CentOS distribution only supports PHP v5.3.3 which is quite old.
</blockquote>

Now that we have our repositories straight, let's get the VM up to date with the latest system updates. Tell '''yum''' to update everything by issuing the following command:

<syntaxhighlight lang="bash" title="remi.repo after">
[vagrant@localhost ~]$ sudo yum upgrade
Loaded plugins: fastestmirror, security
Loading mirror speeds from cached hostfile
epel/metalink                                                                                    |  10 kB     00:00
 * base: mirror.ash.fastserv.com
 * epel: mirror.symnds.com
 * extras: centos.aol.com
 * remi: mirrors.mediatemple.net
 * updates: mirror.symnds.com
base                                                                                             | 3.7 kB     00:00
base/primary_db                                                                                  | 4.4 MB     00:01
epel                                                                                             | 4.2 kB     00:00
epel/primary_db                                                                                  | 5.3 MB     00:02
extras                                                                                           | 3.5 kB     00:00
extras/primary_db                                                                                |  19 kB     00:00
remi                                                                                             | 2.9 kB     00:00
remi/primary_db                                                                                  | 537 kB     00:00
updates                                                                                          | 3.4 kB     00:00
updates/primary_db                                                                               | 3.1 MB     00:01

... yada yada yada ...

Installed:
  kernel.x86_64 0:2.6.32-358.11.1.el6                     kernel-devel.x86_64 0:2.6.32-358.11.1.el6

Dependency Installed:
  compat-mysql51.x86_64 0:5.1.54-1.el6.remi

Updated:
  bind-libs.x86_64 32:9.8.2-0.17.rc1.el6_4.4                     bind-utils.x86_64 32:9.8.2-0.17.rc1.el6_4.4
  coreutils.x86_64 0:8.4-19.el6_4.2                              coreutils-libs.x86_64 0:8.4-19.el6_4.2
  cups-libs.x86_64 1:1.4.2-50.el6_4.4                            curl.x86_64 0:7.19.7-36.el6_4
  dbus-glib.x86_64 0:0.86-6.el6                                  gnutls.x86_64 0:2.8.5-10.el6_4.2
  gzip.x86_64 0:1.3.12-19.el6_4                                  initscripts.x86_64 0:9.03.38-1.el6.centos.1
  iputils.x86_64 0:20071127-17.el6_4                             kernel-firmware.noarch 0:2.6.32-358.11.1.el6
  kernel-headers.x86_64 0:2.6.32-358.11.1.el6                    kexec-tools.x86_64 0:2.0.0-258.el6_4.2
  krb5-devel.x86_64 0:1.10.3-10.el6_4.3                          krb5-libs.x86_64 0:1.10.3-10.el6_4.3
  libblkid.x86_64 0:2.17.2-12.9.el6_4.3                          libcurl.x86_64 0:7.19.7-36.el6_4
  libproxy.x86_64 0:0.3.0-4.el6_3                                libproxy-bin.x86_64 0:0.3.0-4.el6_3
  libproxy-python.x86_64 0:0.3.0-4.el6_3                         libselinux.x86_64 0:2.0.94-5.3.el6_4.1
  libselinux-devel.x86_64 0:2.0.94-5.3.el6_4.1                   libselinux-utils.x86_64 0:2.0.94-5.3.el6_4.1
  libuuid.x86_64 0:2.17.2-12.9.el6_4.3                           libxml2.x86_64 0:2.7.6-12.el6_4.1
  libxml2-python.x86_64 0:2.7.6-12.el6_4.1                       mdadm.x86_64 0:3.2.5-4.el6_4.1
  mysql-libs.x86_64 0:5.5.32-1.el6.remi                          openldap.x86_64 0:2.4.23-32.el6_4.1
  perl.x86_64 4:5.10.1-131.el6_4                                 perl-Module-Pluggable.x86_64 1:3.90-131.el6_4
  perl-Pod-Escapes.x86_64 1:1.04-131.el6_4                       perl-Pod-Simple.x86_64 1:3.13-131.el6_4
  perl-libs.x86_64 4:5.10.1-131.el6_4                            perl-version.x86_64 3:0.77-131.el6_4
  pixman.x86_64 0:0.26.2-5.el6_4                                 selinux-policy.noarch 0:3.7.19-195.el6_4.10
  selinux-policy-targeted.noarch 0:3.7.19-195.el6_4.10           tzdata.noarch 0:2013c-1.el6
  util-linux-ng.x86_64 0:2.17.2-12.9.el6_4.3

Complete!
</syntaxhighlight>

Finally, install the DSP dependencies:

<syntaxhighlight lang="bash" title="remi.repo after">
[vagrant@localhost ~]$ sudo yum install curl httpd php php-common php-cli php-curl php-mcrypt php-gd php-mysql mysql-server git
Loaded plugins: fastestmirror, security
Loading mirror speeds from cached hostfile
 * base: mirror.ash.fastserv.com
 * epel: mirror.symnds.com
 * extras: centos.aol.com
 * remi: mirrors.mediatemple.net
 * updates: mirror.symnds.com

... yada yada yada ...

Installed:
  git.x86_64 0:1.7.1-3.el6_4.1        httpd.x86_64 0:2.2.15-28.el6.centos     mysql-server.x86_64 0:5.5.32-1.el6.remi
  php.x86_64 0:5.4.16-1.el6.remi      php-cli.x86_64 0:5.4.16-1.el6.remi      php-common.x86_64 0:5.4.16-1.el6.remi
  php-gd.x86_64 0:5.4.16-1.el6.remi   php-mcrypt.x86_64 0:5.4.16-1.el6.remi   php-mysql.x86_64 0:5.4.16-1.el6.remi

Dependency Installed:
  apr.x86_64 0:1.3.9-5.el6_2          apr-util.x86_64 0:1.3.9-3.el6_0.1         apr-util-ldap.x86_64 0:1.3.9-3.el6_0.1
  freetype.x86_64 0:2.3.11-14.el6_3.1 httpd-tools.x86_64 0:2.2.15-28.el6.centos libX11.x86_64 0:1.5.0-4.el6
  libXpm.x86_64 0:3.5.10-2.el6        libmcrypt.x86_64 0:2.5.8-9.el6            libtool-ltdl.x86_64 0:2.2.6-15.5.el6
  mailcap.noarch 0:2.1.31-2.el6       mysql.x86_64 0:5.5.32-1.el6.remi          perl-DBD-MySQL.x86_64 0:4.013-3.el6
  perl-DBI.x86_64 0:1.609-4.el6       perl-Error.noarch 1:0.17015-4.el6         perl-Git.noarch 0:1.7.1-3.el6_4.1
  php-pdo.x86_64 0:5.4.16-1.el6.remi  t1lib.x86_64 0:5.1.2-6.el6_2.1

Complete!
</syntaxhighlight>

<caption>Please Note: The actual version and iteration numbers may vary as they will increase over time.</caption>

Start up the MySQL and Apache servers:

<syntaxhighlight lang="bash">
[vagrant@localhost ~]$ sudo chkconfig httpd on
[vagrant@localhost ~]$ sudo chkconfig mysqld on
[vagrant@localhost ~]$ sudo service mysqld start
[vagrant@localhost ~]$ sudo service httpd start
</syntaxhighlight>

Connect to MySQL and create a database and database user for the DSP:

<syntaxhighlight lang="mysql">
[vagrant@localhost ~]$ mysql -u root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.5.32 MySQL Community Server (GPL) by Remi

Copyright (c) 2000, 2013, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> create database dreamfactory;
Query OK, 1 row affected (0.00 sec)

mysql> grant all privileges on dreamfactory.* to 'dsp_user'@'localhost' identified by 'dsp_user';
Query OK, 0 rows affected (0.00 sec)

mysql> exit
Bye
</syntaxhighlight>

At this point your VM is now configured and ready to install the DSP system.

=== Installing the DreamFactory Services Platform&trade; ===

Grab a copy of the latest release from the release package repository. As of this writing, the current DSP version is [https://github.com/dreamfactorysoftware/platform-packages/tree/1.0.4 1.0.4].

<syntaxhighlight lang="bash">
[vagrant@localhost ~]$ wget -O dreamfactory-dsp-1.0.4.noarch.rpm https://github.com/dreamfactorysoftware/platform-packages/blob/1.0.4/dreamfactory-dsp-1.0.4.noarch.rpm?raw=true
--2013-06-17 18:53:30--  https://github.com/dreamfactorysoftware/platform-packages/blob/1.0.4/dreamfactory-dsp-1.0.4.noarch.rpm?raw=true
Resolving github.com... 204.232.175.90
Connecting to github.com|204.232.175.90|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://github.com/dreamfactorysoftware/platform-packages/raw/1.0.4/dreamfactory-dsp-1.0.4.noarch.rpm [following]
--2013-06-17 18:53:35--  https://github.com/dreamfactorysoftware/platform-packages/raw/1.0.4/dreamfactory-dsp-1.0.4.noarch.rpm
Reusing existing connection to github.com:443.
HTTP request sent, awaiting response... 302 Found
Location: https://raw.github.com/dreamfactorysoftware/platform-packages/1.0.4/dreamfactory-dsp-1.0.4.noarch.rpm [following]
--2013-06-17 18:53:36--  https://raw.github.com/dreamfactorysoftware/platform-packages/1.0.4/dreamfactory-dsp-1.0.4.noarch.rpm
Resolving raw.github.com... 199.27.72.133
Connecting to raw.github.com|199.27.72.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1432503 (1.4M) [audio/x-pn-realaudio-plugin]
Saving to: “dreamfactory-dsp-1.0.4.noarch.rpm”

100%[==============================================================================>] 1,432,503   5.30M/s   in 0.3s

2013-06-17 18:53:41 (5.30 MB/s) - “dreamfactory-dsp-1.0.4.noarch.rpm” saved [1432503/1432503]
</syntaxhighlight>

And install it:

<syntaxhighlight lang="bash">
[vagrant@localhost ~]$ sudo rpm -Uvh dreamfactory-dsp-1.0.4.noarch.rpm
Preparing...                ########################################### [100%]
   1:dreamfactory-dsp       ########################################### [100%]
DreamFactory Services Platform(tm) Linux Installer [Mode: Local v1.2.6]
  * Clean install. Dependencies removed.
  * No composer found, installing: /opt/dreamfactory/platform/var/www/launchpad/composer.phar
#!/usr/bin/env php
  * Install user is "root"
  * Created /opt/dreamfactory/platform/var/www/launchpad/shared
  * Checking file system
  * Working directory: /opt/dreamfactory/platform/var/www/launchpad
  * Installing dependencies
  * Created /opt/dreamfactory/platform/var/www/launchpad/log/
  * Created /opt/dreamfactory/platform/var/www/launchpad/storage/
  * Created /opt/dreamfactory/platform/var/www/launchpad/web/public/assets
  * Core linked
  * LaunchPad linked
  * Admin linked

Complete. Enjoy the rest of your day!
</syntaxhighlight>

The package also runs the DSP install/update script. This sets up the directories and loads all non-system dependencies for you. It will take awhile on the stock vagrant VM as the memory footprint is quite small.

Once this step finishes, the DSP is completely installed with all dependencies.

=== Give it a Whirl ===

Open you favorite browser and go to [http://localhost:8080/ http://localhost:8080/]. This is the URL for the DSP we just installed.
