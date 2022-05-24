<?php

/**

 * The base configuration for WordPress

 *

 * The wp-config.php creation script uses this file during the

 * installation. You don't have to use the web site, you can

 * copy this file to "wp-config.php" and fill in the values.

 *

 * This file contains the following configurations:

 *

 * * MySQL settings

 * * Secret keys

 * * Database table prefix

 * * ABSPATH

 *

 * @link https://wordpress.org/support/article/editing-wp-config-php/

 *

 * @package WordPress

 */


// ** MySQL settings - You can get this info from your web host ** //

/** The name of the database for WordPress */

define( 'DB_NAME', "shoppet" );


/** MySQL database username */

define( 'DB_USER', "root" );


/** MySQL database password */

define( 'DB_PASSWORD', "" );


/** MySQL hostname */

define( 'DB_HOST', "localhost" );


/** Database Charset to use in creating database tables. */

define( 'DB_CHARSET', 'utf8mb4' );


/** The Database Collate type. Don't change this if in doubt. */

define( 'DB_COLLATE', '' );


/**#@+

 * Authentication Unique Keys and Salts.

 *

 * Change these to different unique phrases!

 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}

 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.

 *

 * @since 2.6.0

 */

define( 'AUTH_KEY',         '76$hCOc-#/%]CzmAA/=x++vBuyu=6{,%6#l_@*S)nD4n(Ygo9??>6Pl/?5vZhKQc' );

define( 'SECURE_AUTH_KEY',  '#. VE ^E6(3}3Uq#AMe;m:woH/XcBl-F-{ZVN_._.KpfOde;Cc$=0iUeXe/+.()7' );

define( 'LOGGED_IN_KEY',    'BRzRCyvHG;:5R>jrtv6I!PxntS{:vT1CbSn~he<uE$,]}#ZT7FeOksPsZX!vuwV<' );

define( 'NONCE_KEY',        '{q:(}.>NEgmYC:<e|a|r5w{7iJWrrCdtD~dNhYbx~2rf~WbW6,a^=w%tdO6WN+n_' );

define( 'AUTH_SALT',        '}NUv cmJ8Ci#Fzw/C$?Cq9b`$j4:B^dsHl+3Ml<3rx.u)w@C)-(``vN.y7olp^-{' );

define( 'SECURE_AUTH_SALT', 'In+WQE%O.{}3lgm~M@W4]BYl BcE]mOYCGggqIWD.(Y?qEnpO//tEn^nXpc]s{6(' );

define( 'LOGGED_IN_SALT',   'bL(&fNdpy:d6x5X@xphbFLh!Hp2LG1N%~X{YAJha9C0B$UJ5%BGd(7Fw{&}I_X^^' );

define( 'NONCE_SALT',       'dVU?n~;PTQ%uZ3WtV 5[v%L>  7X+*o`W;Wt^B7rwQb`oeF]c)217Odlsy-_jqa;' );


/**#@-*/


/**

 * WordPress Database Table prefix.

 *

 * You can have multiple installations in one database if you give each

 * a unique prefix. Only numbers, letters, and underscores please!

 */

$table_prefix = 'wp_';


/**

 * For developers: WordPress debugging mode.

 *

 * Change this to true to enable the display of notices during development.

 * It is strongly recommended that plugin and theme developers use WP_DEBUG

 * in their development environments.

 *

 * For information on other constants that can be used for debugging,

 * visit the documentation.

 *

 * @link https://wordpress.org/support/article/debugging-in-wordpress/

 */

define( 'WP_DEBUG', false );


/* That's all, stop editing! Happy publishing. */


/** Absolute path to the WordPress directory. */

if ( ! defined( 'ABSPATH' ) ) {

	define( 'ABSPATH', __DIR__ . '/' );

}


/** Sets up WordPress vars and included files. */

require_once ABSPATH . 'wp-settings.php';

