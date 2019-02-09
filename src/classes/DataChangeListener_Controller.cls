global with sharing class DataChangeListener_Controller {

    @AuraEnabled(cacheable=true)
    global static User getRunningUser(){
        Id userId = UserInfo.getUserId();
        return [SELECT Id, FirstName, LastName FROM User WHERE Id =: userId];  
    }
}