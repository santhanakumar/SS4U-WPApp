SS4U-WPApp
==========

Ionic app for wordpress

How to use this app
-------------------

This app does not work on its own. It is missing the Ionic library, and cordova plugins.

To use this, either create a new ionic project using the ionic node.js utility, or copy and paste this into an existing Cordova project and download a release of Ionic separately.

Installation
-----------

```
$ sudo npm install -g ionic cordova
$ sudo ionic start myApp balnk
```
For socail sharing include cordova plugin [Social Sharing plugin](https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin)

```
$ ionic plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
```
or
```
$ cordova plugin add nl.x-services.plugins.socialsharing
```

Replace the _www_ folder with the current branch files.

Wordpress setup
---------------

Install latest wordpress in your server and install the following plugins,
* [JSON API](https://wordpress.org/plugins/json-api/)
* [JSON API User](https://wordpress.org/plugins/json-api-user/). After installing it should enabled in wordpress settings.
* [WP REST API (WP API)](https://wordpress.org/plugins/json-rest-api/) Note: This might be confilict with json api plugin.We have planned to remove it in future.
