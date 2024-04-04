<?php
	header("Access-Control-Allow-Origin: *");
    require 'rb-sqlite.php';

    R::setup('sqlite:./solarspell.db');
    R::getDatabaseAdapter()->getDatabase()->stringifyFetches( FALSE );
    #R::fancyDebug(TRUE);
    
    $folders = R::findAll("folder", " parent_id IS NULL order by order_by asc, folder_name asc");
    print(json_encode(array_values($folders)));
?>