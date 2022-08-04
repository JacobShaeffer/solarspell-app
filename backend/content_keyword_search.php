<?php
header("Access-Control-Allow-Origin: *");
header( 'Access-Control-Allow-Headers: Authorization, Content-Type' );
require 'rb-sqlite.php';
R::setup('sqlite:./solarspell.db');
R::getDatabaseAdapter()->getDatabase()->stringifyFetches( FALSE );
#R::fancyDebug(TRUE);
$keyword = $_GET["keyword_name"];
$contentList = R::find( 'content', ' lower(@shared.metadata.meta_name) = :keyword AND @shared.metadata.type_name = :keyword_label', [ ':keyword' => $keyword, ':keyword_label' => 'Keywords' ] );
$result_object =  new \stdClass();
$result_object->searchString = $keyword;
$result_object->contentList = array_values($contentList);
echo json_encode($result_object);
?>
