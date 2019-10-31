/* -------------------------- */
/* myindexedDB
/* -------------------------- */


const indexedDBModule = (function(){

  //'global' index;
      var i = 0;
  //keep a refference to the database name in dbName
  
  
  //prefixes of implementation that we want to Test
      var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  //not used yet
      var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
      var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  
      var init = function(db,store) {
          if (!indexedDB) {
              alert("Sorry!Your browser doesn't support IndexedDB");
          } else {
              initDB(db,store);
          }
      };
  
      var destroy = function(db){
          try {
              //request to delete the entire database
              if(!db || db=='')
                  var dbDeleteRequest = indexedDB.deleteDatabase(DB_NAME);
              else var dbDeleteRequest = indexedDB.deleteDatabase(db);
              dbDeleteRequest.onsuccess = function(e) {
                  alert('Database successfully deleted');
                  /*
                   * I found out that when I need to destroy the database and recreate
                   * it, there are some issues. I tried to destroy database, create database,
                   * insert items, deleteAllItems, count the items in the objectStore etc...
                   * after destroying the database, a location.reaload() helps refreshing these operations
                   */
                  location.reload();
              };
              dbDeleteRequest.onupgradeneeded = function(e) {
                  console.log('Database upgrade needed ');
              };
              dbDeleteRequest.onerror = function(e) {
                  console.log('Error deleting database ');
              };
              dbDeleteRequest.onblocked = function(e) {
                  console.log('Deleting Database Blocked... Try closing the database and then deleting it ');
              };
          } catch (e) {
              console.log(e);
              alert('Error on destroy -> deleteDatabase ');
          }
      };
  
      var createItem = function(id,data,store,update,dbName){
          try {
              console.log("Dbname"+dbName)
              //request to open the database
              var dbOpenRequest = indexedDB.open(dbName);
              dbOpenRequest.onsuccess = function(event) {
  
                  var thisDB = dbOpenRequest.result;
                  console.log(thisDB)
                  thisDB.onversionchange = function(e) {
                      console.log('Version change triggered, so closing database connection ' + e.oldVersion + ' ' + e.newVersion + ' ' +thisDB);
                      thisDB.close();
                  };
                  try{
                      var transaction = thisDB.transaction([store], "readwrite");
  
                      transaction.oncomplete = function(e) {
                          console.log('transaction is complete ');
                      };
                      transaction.onabort = function(e) {
                          var error = e.target.error; // DOMError
                          if (error.name == 'QuotaExceededError') {
                              alert('createItem -> transaction['+store+'] -> onabort - QuotaExceededError ');
                          }
                          console.log('transaction aborted ');
                      };
                      transaction.onerror = function(e) {
                          console.log('transaction error');
                      };
                      try {
  
                          var request;
                          var objectStore = transaction.objectStore(store);
                          if(update && update==true){
                              //request to UPDATE new entry in the object store
                              request = objectStore.put(data);
                          } else{
                              //request to ADD entry in the object store
                              request = objectStore.add(data);
                          }
                          request.onsuccess = function(event) {
                              //var element = event.target.result;
                              if(update && update == true)
                                  console.log('The record with ID = ' + id + ' has been updated in the database ');
                              else console.log('A new record with ID = ' + id + ' has been added to the database ');
                          };
                          request.onerror = function(event) {
                              if (update && update == true){
                                  console.log('Error. Could not update record with id = ' + id);
                              }
                              else {
                                  console.log('Error ' + event + ' This record is already in the database. ');
                              }
                          };
                      } catch (e) {
                          console.log(e)
                          console.log('Could not operate on '+ '['+store+']' +'. You may have to create it first ');
                      };
                  } catch(e){
                      console.log('Error ' + e);
                  };
              };
              dbOpenRequest.onupgradeneeded = function(e) {
                  console.log('Database upgrade needed ');
                  //not used
                  //var db = dbOpenRequest.result;
                  //var transaction = dbOpenRequest.transaction;
              };
              dbOpenRequest.onerror = function(e){
                  console.log('Error ');
              };
              dbOpenRequest.onblocked = function(e) {
                  console.log('Database open request blocked ');
              };
          } catch(e){
              console.log('Error ');
          };
      };
  
      var readItem = function(id,store,dbName) {
          try {
              var dbOpenRequest = indexedDB.open(dbName);
              dbOpenRequest.onsuccess = function(event) {
                  var thisDB = dbOpenRequest.result;
                  thisDB.onversionchange = function(e) {
                      console.log('Version change triggered, so closing database connection ' + e.oldVersion + ' ' + e.newVersion + ' ' +thisDB);
                      thisDB.close();
                  };
                  try{
                      var transaction = thisDB.transaction([store], "readonly");
                      transaction.oncomplete = function(e) {
                          console.log('transaction is complete ');
                      };
                      transaction.onabort = function(e) {
                          console.log('transaction aborted ');
                      };
                      transaction.onerror = function(e) {
                          console.log('transaction error ');
                      };
  
                      try {
                          var objectStore = transaction.objectStore(store);
                          var request = objectStore.get(id);
                          request.onsuccess = function(event) {
                              var element = event.target.result;
                              if(element!==undefined){
                                  console.log('Elemtent with id = ' + id + ' was found\n' + JSON.stringify(element));
                              }
                              else{
                                  console.log('Element with id = ' + id + ' does not exist in the IndexedDB ');
                              }
                          };
                          request.onerror = function(event){
                              console.log('Error - could not request data from the object store ' + event);
                          };
                      } catch (e) {
                          console.log('Could not operate on '+ '['+store+']' +'. You may have to create it first ');
                      }
                  } catch(e){
                      console.log('Error ');
                  }
              };
              dbOpenRequest.onupgradeneeded = function(e) {
                  console.log('Database upgrade needed ');
                  //var db = dbOpenRequest.result;
                  //var transaction = dbOpenRequest.transaction;
              };
              dbOpenRequest.onerror = function(e){
                  console.log('Error ');
              };
              dbOpenRequest.onblocked = function(e) {
                  console.log('Database open request is blocked ');
              };
          } catch(e){
              console.log('Error ');
          };
      };
  
      var updateItem = function(id,data,store,dbName){
          createItem(id,data,store,true,dbName);
      };
  
      var deleteItem = function(id,store,dbName) {
          try {
              var dbOpenRequest = indexedDB.open(dbName);
              dbOpenRequest.onsuccess = function(event) {
                  var thisDB = dbOpenRequest.result;
                  thisDB.onversionchange = function(e) {
                      console.log('Version change triggered, so closing database connection ' + e.oldVersion + ' ' + e.newVersion + ' ' +thisDB);
                      thisDB.close();
                  };
                  try{
                      //attempt to create a transaction
                      var transaction = thisDB.transaction([store], "readwrite");
                      transaction.oncomplete = function(e) {
                          console.log('transaction is complete ');
                      };
                      transaction.onabort = function(e) {
                          console.log('transaction aborted ');
                      };
                      transaction.onerror = function(e) {
                          console.log('Transaction error -> [deleteItem] ');
                      };
  
                      try {
                          var objectStore = transaction.objectStore(store);
                          var getRequest = objectStore.get(id);
                          getRequest.onsuccess = function(e){
                              if (e.target.result != null) {
                                  console.log('Object Exist');
                                  //request to delete entry from the object store
                                  var request = objectStore.delete(id);
                                  request.onsuccess = function(event){
                                      console.log('Entry id = ' + id + ' was deleted from the database');
                                  };
                                  request.onerror = function(event){
                                      console.log('Error [deleteItem] -> delete('+id+') ');
                                  };
                              }else{
                                  console.log('Object doesn\'t exist ');
                              }
                          };
                          getRequest.onerror = function(e){
                              console.log('Error [deleteItem] -> delete('+id+') ');
                          };
                      } catch (e) {
                          console.log('Could not operate on '+ '['+store+']' +'. You may have to create the entry first ');
                      }
                  } catch(e){
                      console.log('Error ');
                  }
              };
              dbOpenRequest.onupgradeneeded = function(e) {
                  console.log('Database upgrade needed ');
                  //var db = dbOpenRequest.result;
                  //var transaction = dbOpenRequest.transaction;
              };
              dbOpenRequest.onerror = function(e){
                  console.log('Error ');
              };
              dbOpenRequest.onblocked = function(e) {
                  console.log('Database open request is blocked ');
              };
          } catch(e){
              console.log('Error ');
          }
      };
  
      var insertItems = function(store,obj,length){
          //inserts the same item multiple times in the same transaction.
          //just a test
          try {
              //request to open the database
              var dbOpenRequest = indexedDB.open(dbName);
              dbOpenRequest.onsuccess = function(event) {
                  var thisDB = dbOpenRequest.result;
                  thisDB.onversionchange = function(e) {
                      console.log('Version change triggered, so closing database connection ' + e.oldVersion + ' ' + e.newVersion + ' ' +thisDB);
                      thisDB.close();
                  };
                  try{
                      //creating transaction to open an object store in "readwrite" mode
                      var transaction = thisDB.transaction([store], 'readwrite');
                      transaction.oncomplete = function(e) {
                          console.log('transaction is complete ');
                      };
                      transaction.onabort = function(e) {
                          var error = e.target.error; // DOMError
                          console.log('transaction aborted ' + error);
                      };
                      transaction.onerror = function(e) {
                          console.log('transaction error ');
                      };
  
                      try {
                          var request;
                          var objectStore = transaction.objectStore(store);
  
                          putNext();
  
                          function putNext() {
                              if (i<length) {
                                  objectStore.add(obj).onsuccess = putNext;
                                  //console.log('add entry with id = ' + i);
                                  ++i;
                              } else {
                                  // complete
                                  console.log('insertItems -> DONE');
                                  //callback();
                              }
                          }
                      } catch (e) {
                          console.log('Could not operate on '+ '['+store+']' +'. You may have to create it first ');
                      };
                  } catch(e){
                      console.log('Error ');
                  };
                  //when done
                  //callback();
              };
              dbOpenRequest.onupgradeneeded = function(e) {
                  console.log('Database upgrade needed ');
              };
              dbOpenRequest.onerror = function(e){
                  console.log('Error ');
              };
              dbOpenRequest.onblocked = function(e) {
                  console.log('Database open request blocked ');
              };
          } catch(e){
              console.log('Error ');
          };
      };
  
      var readAllItems = function(store,dbName,back) {
          try {
              var dbOpenRequest = indexedDB.open(dbName);
              dbOpenRequest.onsuccess = function(event) {
                  var thisDB = dbOpenRequest.result;
                  thisDB.onversionchange = function(e) {
                      console.log('Version change triggered, so closing database connection ' + e.oldVersion + ' ' + e.newVersion + ' ' +thisDB);
                      thisDB.close();
                  };
                  try{
                      var transaction = thisDB.transaction([store], "readonly");
                      transaction.oncomplete = function(e) {
                          console.log('transaction is complete ');
                      };
                      transaction.onabort = function(e) {
                          console.log('transaction aborted ');
                      };
                      transaction.onerror = function(e) {
                          console.log('transaction error ');
                      };
                      try {
                          var objectStore = transaction.objectStore(store);
                          //request cursor on the object store
                          var request = objectStore.openCursor();
                          var count = 0;
                          request.onsuccess = function(event) {
                              var cursor = event.target.result;
                              if (cursor) {
                                  console.log('id = ' + cursor.key + ' is ' + cursor.value);
                                  count++;
                                  back( cursor.key ,cursor.value);
                                  cursor['continue']();
  
                              } else console.log('Total entries = ' + count);
                          };
                          request.onerror = function(e){
                              console.log('transaction error on readAllItems -> oenCursor -> onerror ');
                          };
                      } catch (e) {
                          console.log('Could not operate on '+ '['+store+']' +'. You may have to create it first ');
                      }
                  } catch(e){
                      console.log('Error ');
                  }
              };
              dbOpenRequest.onupgradeneeded = function(e) {
                  console.log('Database upgrade needed ');
                  //var db = dbOpenRequest.result;
                  //var transaction = dbOpenRequest.transaction;
              };
              dbOpenRequest.onerror = function(e){
                  console.log('Error ');
              };
              dbOpenRequest.onblocked = function(e) {
                  console.log('Database open request is blocked ');
              };
          } catch(e){
              console.log('Error ');
          }
      };
  
      var deleteAllItems = function(store,count,dbName){
          try {
              var dbOpenRequest = indexedDB.open(dbName);
              dbOpenRequest.onsuccess = function(event) {
                  var thisDB = dbOpenRequest.result;
                  thisDB.onversionchange = function(e) {
                      console.log('Version change triggered, so closing database connection ' + e.oldVersion + ' ' + e.newVersion + ' ' +thisDB);
                      thisDB.close();
                  };
                  try{
  
                      var transaction = thisDB.transaction([store], "readwrite");
                      transaction.oncomplete = function(e) {
                          console.log('transaction is complete ');
                      };
                      transaction.onabort = function(e) {
                          console.log('transaction aborted ');
                      };
                      transaction.onerror = function(e) {
                          console.log('transaction error ');
                      };
                      try {
                          //open object store
                          var objectStore = transaction.objectStore(store);
                          try{
                              //count items in the object store
                              var requestCount = objectStore.count();
                              requestCount.onsuccess = function(event){
                                  console.log(store+"--"+dbName)
                                  console.log(requestCount.result)
  
  
                                      if(requestCount.result!=0){
                                          //request to clear the object store
                                          var request = objectStore.clear();
                                          console.log("clear")
                                          console.log(request)
                                          request.onsuccess = function(event) {
                                              console.log('No more entries to delete in the object store!');
                                              //reset 'global' index
                                              i = 0;
                                          };
                                          request.onerror = function(event) {
                                              console.log('Error clearing the object store! ' + event);
                                          };
                                      }
                                      else {
                                          console.log('Object store is already empty');
                                      }
                              };
                              requestCount.onerror = function(event){
                                  console.log('Error counting elements in the store ');
                              };
                          } catch(e){
                              console.log('Error ');
                          }
                      } catch (e) {
                          console.log('Could not operate on '+ '['+store+']' +'. You may have to create it first ');
                      }
                  } catch(e){
                      console.log('Error ');
                  }
              };
              dbOpenRequest.onupgradeneeded = function(e) {
                  console.log('Database upgrade needed ');
              };
              dbOpenRequest.onerror = function(e){
                  console.log('Error ');
              };
              dbOpenRequest.onblocked = function(e) {
                  console.log('Database open request is blocked ');
              };
          } catch(e){
              console.log('Error ');
          }
      };
  
      /************ helper functions ****************/
      function initDB(db,store) {
          try {
              var dbOpenRequest = indexedDB.open(db,1);
              dbOpenRequest.onsuccess = function(event) {
                  var thisDB = dbOpenRequest.result;
                  // Need to create this variable since the variable db is assigned to other things later
                  thisDB.onversionchange = function(e) {
                      console.log('Version change triggered, so closing database connection ' + e.oldVersion + ' ' + e.newVersion + ' ' + thisDB);
                      thisDB.close();
                  };
                  console.log('Database '+db+' is created with objectStore '+store);
                  dbName = db;
              };
              dbOpenRequest.onupgradeneeded = function(e) {
                  var thisDB = dbOpenRequest.result;
                  var transaction = dbOpenRequest.transaction;
                  try {
                      var storeOptions = {autoIncrement : true,keyPath:"Pid"}; //possible pass storeOptions in init and further to initDB
                      var objectStore = thisDB.createObjectStore(store,storeOptions);
  
                  } catch (e) {
                      console.log('Error occured while creating object store ');
                  }
              };
              dbOpenRequest.onerror = function(e) {
                  console.log('Error ');
              };
              dbOpenRequest.onblocked = function(e) {
                  console.log('Blocked ');
              };
          } catch (e){
              console.log('Error ');
          }
      }
      /******** helpers **********/
  
      return{
          init : init,
          destroy : destroy,
          createItem : createItem,
          readItem : readItem,
          updateItem : updateItem,
          deleteItem : deleteItem,
          insertItems : insertItems,
          readAllItems : readAllItems,
          deleteAllItems : deleteAllItems
      };
  }())

  export default indexedDBModule