<?php
    #List of columns in usage table, add columns when they are added to table
    $columns = [
        'title',
        'activity_type',
        'language',
        'content_type',
        'subject',
        'parent_folder',
        'keyword',
        'creator',
        'audience',
        'format',
        'rights_holder',
        #Removed dates dropdown
        #'min_date',
        #'max_date',
        'referrer',
        'activity_date'
    ]; 
    
    #Allow this file to be accessed from other ports/hosts
    header("Access-Control-Allow-Origin: *");

    #Connect to database
    require 'rb-sqlite.php';
    R::setup('sqlite:./solarspell.db');
    R::getDatabaseAdapter()->getDatabase()->stringifyFetches( FALSE );

    #Initialize usage table and add parameters
    $usage = R::dispense('usage');

    foreach($columns as $col) {
        if(isset($_GET[$col])) {
            $usage[$col] = $_GET[$col];
        }
    }

    #Add device information to usage table
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    $ua_arr = get_browser($user_agent, true);
    $usage->browser  = $ua_arr['parent'];
    $usage->device_type = $ua_arr['device_type'];
    $usage->device_os = $ua_arr['platform']; 

    #Send usage table to database
    R::store( $usage );
?>