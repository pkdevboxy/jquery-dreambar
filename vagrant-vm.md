{{DISPLAYTITLE:Create a DSP VM using Vagrant}}

== Vagrant ==

From the [http://vagrantup.com Vagrant] web site:

<blockquote>
<p>Vagrant is a tool for building complete development environments. With an easy-to-use workflow and focus on automation, Vagrant lowers development environment setup time, increases development/production parity, and makes the "works on my machine" excuse a relic of the past.</p>
<p>Vagrant was started in January 2010 by Mitchell Hashimoto. For almost three years, Vagrant was a side-project for Mitchell, a project that he worked on in his free hours after his full time job. During this time, Vagrant grew to be trusted and used by a range of individuals to entire development teams in large companies.</p>
<p>In November 2012, HashiCorp was formed by Mitchell to back the development of Vagrant full time. HashiCorp builds commercial additions and provides professional support and training for Vagrant.</p>
<p>Vagrant remains and always will be a liberally licensed open source project. Each release of Vagrant is the work of hundreds of individuals' contributions to the open source project.</p>
</blockquote>

=== Installation and Setup ===

Installing and setting up [http://vagrantup.com vagrant] is beyond the scope of this guide. However, excellent resources are available on the [http://vagrantup.com Vagrant] web site as well as the [http://google.com/ Google].

You are free to choose the distribution of your preference. Once set up, this guide will diverge to the appropriate package installation guide a little further down.

=== Choosing a Distribution ===

The examples on the vagrant web site use Ubuntu 12.04 LTS mostly, however you're free to choose any operating system that has a Vagrant Box available. You can even make your own.  A list of public Vagrant boxes is available at [http://vagrantbox.es/ VagrantBox.es]

== Creating Your VM ==

=== CentOS VM ===

If you have already downloaded a Vagrant box for CentOS you can skip this step. For this example, we're going to download and install a CentOS 6 x64 image from PuppetLabs:

<syntaxhighlight lang="bash">
you@yours:~/vagrant-images$ vagrant box add centos6 http://puppet-vagrant-boxes.puppetlabs.com/centos-64-x64-vbox4210-nocm.box
[vagrant] Downloading with Vagrant::Downloaders::HTTP...
[vagrant] Downloading box: http://puppet-vagrant-boxes.puppetlabs.com/centos-64-x64-vbox4210-nocm.box
[vagrant] Extracting box...
[vagrant] Verifying box...
[vagrant] Cleaning up downloaded box...
</syntaxhighlight>

Once you've downloaded the box, simply tell Vagrant to start it up:

<syntaxhighlight lang="bash">
you@yours:~/vagrant-images$ vagrant up
[default] Importing base box 'centos6'...
[default] No guest additions were detected on the base box for this VM! Guest
additions are required for forwarded ports, shared folders, host only
networking, and more. If SSH fails on this machine, please install
the guest additions and repackage the box to continue.

This is not an error message; everything may continue to work properly,
in which case you may ignore this message.
[default] Matching MAC address for NAT networking...
[default] Clearing any previously set forwarded ports...
[default] Forwarding ports...
[default] -- 22 => 2222 (adapter 1)
[default] Creating shared folders metadata...
[default] Clearing any previously set network interfaces...
[default] Booting VM...
[default] Waiting for VM to boot. This can take a few minutes.
[default] VM booted and ready for use!
[default] Mounting shared folders...
[default] -- v-root: /vagrant
</syntaxhighlight>

This creates a virtual machine with the image that was just downloaded. SSH is available on port 2222 and a user named ''vagrant'' with a password of ''vagrant'' has been created that has sudo privileges.

== Configuring Your VM ==
== Installing the DreamFactory Services Platform&trade; ==

== Configuring Your VM ==
== Installing the DreamFactory Services Platform&trade; ==
