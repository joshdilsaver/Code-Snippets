# Code Snippets

# iThemes Security - Disable SSL if locked out
in wp-config.php you will notice following two lines where SSL is defined as true

// iThemes Security Config Details: 2
define( 'FORCE_SSL_LOGIN', true ); // Force SSL for Dashboard - Security > Settings > Secure Socket Layers (SSL) > SSL for Dashboard
define( 'FORCE_SSL_ADMIN', true ); // Force SSL for Dashboard - Security > Settings > Secure Socket Layers (SSL) > SSL for Dashboard
// END iThemes Security - Do not modify or remove this line

Change that true to false so it should be like below.

// iThemes Security Config Details: 2
define( 'FORCE_SSL_LOGIN', false ); // Force SSL for Dashboard - Security > Settings > Secure Socket Layers (SSL) > SSL for Dashboard
define( 'FORCE_SSL_ADMIN', false ); // Force SSL for Dashboard - Security > Settings > Secure Socket Layers (SSL) > SSL for Dashboard
// END iThemes Security - Do not modify or remove this line

# Themify - Open link in lightbox
It is possible to make any link to be lightbox link. You just need to add 
" class='themify_lightbox' " 
class to any link.  Also, please note that the href can be any link.  So, it will open in lightbox

To change both width and height:
https://themify.me?width=80%&height=80%
