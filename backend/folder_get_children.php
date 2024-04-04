<?php
header("Access-Control-Allow-Origin: *");
require 'rb-sqlite.php';

R::setup('sqlite:./solarspell.db');
R::getDatabaseAdapter()->getDatabase()->stringifyFetches( FALSE );
#R::fancyDebug(TRUE);

$folder_id = $_GET["folder_id"];
$parent_folder = R::load("folder", $folder_id);
$folders = R::find('folder', 'parent_id = ?  ORDER BY folder_name asc', [$folder_id] );
$content = R::getAll('SELECT * FROM content_folder WHERE folder_id = ? ORDER BY title asc', [$folder_id] );
// get thumbnail for each content and add it to it's own object
$result_object =  new \stdClass();
$result_object->parentFolder = $parent_folder;
$result_object->folders = array_values($folders);  
$result_object->content = array_values($content);
if($parent_folder->parent_id == null){
	$result_object->logo = $parent_folder->logo;
}
else{
$result_object->logo = getParentLogo($folder_id); 
} 
  
//return result array
echo json_encode($result_object);

    function getParentLogo($folder_id){
		$childFolder = R::load("folder", $folder_id);
        $parent_id = $childFolder->parent_id;
	    $parentFolder = R::load("folder", $parent_id);
        if ($parentFolder->parent_id == null) {
            return $parentFolder->logo;
        }
        else { 
            return getParentLogo($parent_id);
        }
    }
?>