({
    grabUser : function(component){
        let action = component.get("c.getRunningUser");
        action.setCallback(this, response => {
            let state = response.getState();
            let result = response.getReturnValue();
            if(state === "SUCCESS"){
                component.set("v.User", result);
                console.log('User : ' + JSON.stringify(result));
            } else {
                //implement error handling here
                console.log(state);
            }
        });
        $A.enqueueAction(action);
    },

    subscribe : function(component, sObject) {

        const empApi = component.find("empApi");
        let channel = this.getChannelName(sObject);
        let replayId = -1;
        let user = component.get("v.User");
        let supported = component.get("v.supportedObjects").includes(sObject);

        //need to do a check of who last modified the record and not fire if its the logged in user
        let subscribeCallback = function (message) {
            console.log(JSON.stringify(message));
            component.set("v.payload", message.data.payload);
        }.bind(this);

        if(this.uniqueSubscription(sObject, component.get("v.Subscriptions")) && supported ) {
            empApi.subscribe(channel, replayId, subscribeCallback).then(function(newSubscription){
                console.log('listening to channel: ' + channel + ' current subscription: ' + JSON.stringify(newSubscription));
                let newlist = component.get("v.Subscriptions")
                newlist.push(newSubscription);
                component.set("v.Subscriptions",newlist);
            });
         }
    },

    unsubscribe : function(component, subscription){
        
        const empApi = component.find("empApi");

        let closeCallback = function(message){
            let newSubs = component.get("v.Subscriptions");
            if(newSubs) newSubs.filter(item => item.subscription != message.subscription);
            component.set("v.Subscriptions", newSubs);
            console.log('unsubscribed from channel ' + JSON.stringify(message));
        }.bind(this);

        empApi.unsubscribe(subscription, closeCallback);
    },

    getChannelName : function(sObjectName){
        return `/data/${sObjectName}ChangeEvent`;
    },
    
    uniqueSubscription : function(sObject, subscriptions){
        let subIndex = subscriptions.map(item => item.channel);
        sObject = `/data/${sObject}ChangeEvent`;
        return !subIndex.includes(sObject);
    },

})