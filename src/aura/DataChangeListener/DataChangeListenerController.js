({
    doInit : function(component, event, helper){
        helper.grabUser(component);
    },

    onTabFocused : function(component, event, helper){
        const workspaceAPI = component.find("workspace");
        let subscriptions = component.get("v.Subscriptions"),
            recordIds = new Array(),
            currentTabObjects = new Array();
        //returns a promise
        workspaceAPI.getAllTabInfo()
        .then(function(tabInfo){
            //translates new array of sObject names. FROM '/data/AccountChangeEvent' to  'Account'
            let sObjectNames = subscriptions.map(sub => {
                let { channel } = sub;
                return channel.substring(
                    channel.lastIndexOf('/') + 1,
                    channel.indexOf('ChangeEvent')
                );
            });

            tabInfo.forEach(item => {
                 let { recordId, pageReference: { attributes: { objectApiName } } } = item;
                 if(!recordIds.includes(recordId)) recordIds.push(recordId);
                 if(!currentTabObjects.includes(objectApiName)) currentTabObjects.push(objectApiName);
                 if(!sObjectNames.includes(objectApiName)) helper.subscribe(component, objectApiName);
            });
            
            component.set("v.recordArray", recordIds);
            return { sObjectNames, recordIds, currentTabObjects };
        })
        //Compare Subscriptions and tabInfo sObjects to Check to see if we need to remove any subscriptions
        .then(function(data){
            let { sObjectNames, recordIds, currentTabObjects } = data;
            sObjectNames.forEach(function(i){
                if(!currentTabObjects.includes(i)){
                    let subs = component.get("v.Subscriptions").find(item => item.channel == helper.getChannelName(i));
                    helper.unsubscribe(component, subs);
                }
            });
        });
    },

    onTabClosed : function(component, event, helper){
        const workspace = component.find('workspace');
        workspace.getAllTabInfo().then(function(tabInfo){
            if(tabInfo.length == 0){
                component.get("v.Subscriptions").forEach(function(sub){
                    helper.unsubscribe(component, sub);
                });
                component.set("v.recordArray", []);
                component.set("v.Subscriptions", []);
            }
        });
    },

    fireCDCEvent : function(component, event){
        let payload = component.get("v.payload"),
            UserId = component.get("v.User").Id,
            modifiedById = payload.ChangeEventHeader.commitUser;

        let cdcEvent = $A.get("e.c:Notification");
        cdcEvent.setParams({ 
            "name": "Data Change Event",
            "data": payload
        });
        //only fire Application Evt if the record was not modified by logged in user 
        if(UserId !== modifiedById || component.get("v.demo")) cdcEvent.fire();
        
    }
})