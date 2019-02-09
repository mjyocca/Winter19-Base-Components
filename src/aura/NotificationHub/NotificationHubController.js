({
    clearNotifs: function(component){
        component.set("v.notificationItems", []);
        let utilityAPI = component.find("utilitybar");
        utilityAPI.setUtilityHighlighted({highlighted: false});
    },

    myAction : function(component, event) {

        let message = event.getParam("data");
        let name = event.getParam("name");

        let item = {
            sObject : message.ChangeEventHeader.entityName.toLowerCase(),
            Id : message.ChangeEventHeader.recordIds[0],
            date : message.LastModifiedDate
        };

        let changedValues = new Array();
        for(let [key, value] of Object.entries(message)){
            if(key != 'LastModifiedDate' && key != 'ChangeEventHeader'){
                changedValues.push({key: key, value: JSON.stringify(value)});
            }
        }

        item.changedValues = changedValues;

        let notifyItems = component.get("v.notificationItems") || new Array();
            notifyItems.push(item);

        component.set("v.notificationItems", notifyItems);

        let utilityAPI = component.find("utilitybar");
            utilityAPI.setUtilityIcon({icon: 'announcement'});
            utilityAPI.setUtilityLabel({label: name});
            utilityAPI.setUtilityHighlighted({highlighted: true});

        setTimeout(
            $A.getCallback(function(){
                utilityAPI.setUtilityHighlighted({highlighted: false});
            }), 2000
        );
    }
})