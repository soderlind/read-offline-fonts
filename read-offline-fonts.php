<?php
/*
Plugin Name: Read Offline Fonts
Plugin URI: http://soderlind.no/archives/2012/10/01/read-offline/
Description: Complete mPDF font pack for <a href="https://wordpress.org/plugins/read-offline/">Read Offline</a>
Author: Per Soderlind
Version: 0.6.1
Author URI: http://soderlind.no
Text Domain: read-offline-fonts
Domain Path: /languages
*/
defined( 'ABSPATH' ) or die();

add_action('plugins_loaded', function() {
	if ( ! class_exists( 'Read_Offline' ) || ( version_compare( READOFFLINE_VERSION, '0.6.0' ) < 0 ) )  {
	    return add_action( 'admin_notices', 'read_offline_fonts_admin_notice' );
	}
});

add_action('init',function() {
	if ( class_exists( 'Read_Offline' ) || ( version_compare( READOFFLINE_VERSION, '0.6.0' ) > 0 ) ) {
		define( 'READ_OFFLINE_FONTS', __DIR__ . '/ttfonts/' );
	}
}, 9 );

function read_offline_fonts_admin_notice () {
    $msg[] = '<div class="error"><p>';
    $msg[] = '<strong>Read Offline Fonts</strong>:';

	if  ( ! class_exists( 'Read_Offline' ) ) {
		$msg[] = __('Read Offline Fonts is an add-on to Read Offline, please download and install','read-offline-fonts') . ' <a href="https://wordpress.org/plugins/read-offline/">Read Offline</a>';
	}

	if  ( version_compare( READOFFLINE_VERSION, '0.5.0' ) < 0 )  {
		$msg[] = __('Read Offline Fonts requires Read Offline 0.6.0 or newer, please upgrade','read-offline-fonts') . ' <a href="update-core.php">Read Offline</a>';
	}

    $msg[] = '</p></div>';
    echo implode( PHP_EOL, $msg );
}
