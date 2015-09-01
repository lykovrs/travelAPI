/**
 * Created by Lykov Roman on 28.08.2015.
 */
'use strict';

var cards = [
    {
        "name": "Gerona Airport",
        "type": "aircraft",
        "number": "SK455",
        "from": "Barcelona",
        "to": "Stockholm",
        "seat": "3A",
        "gate": "45B",
        "baggage": "Baggage drop at ticket counter 344"
    },
    {
        "name": "Madrid",
        "type": "train",
        "number": "78A",
        "from": null,
        "to": "Barcelona",
        "seat": "45B"
    },
    {
        "name": "Stockholm",
        "type": "aircraft",
        "number": "SK22",
        "from": "Gerona Airport",
        "to": "New York JFK",
        "seat": "7B",
        "gate": "22",
        "baggage": "Baggage will be automatically transferred from your last leg"
    },
    {
        "name": "New York JFK",
        "from": "Stockholm",
        "to": null
    },
    {
        "name": "Barcelona",
        "type": "bus",
        "number": "78A",
        "from": "Madrid",
        "to": "Gerona Airport",
        "seat": "No seat assignment"
    }

];

var opt = {
    selector: 'container',
    itemTag: 'li',
    itemTagClassName: 'list__item'
};

(function(obj, opt){
    var options = {
        selector: opt.selector,
        itemTag: opt.itemTag,
        itemTagClassName: opt.itemTagClassName,
        cards : obj
    };

    var containerIdSelector = options.selector,
        itemTag = options.itemTag,
        itemTagClassName = options.itemTagClassName,
        cards = options.cards,
        collection;


    function Waypoint(point){
        this.name = point.name;
        this.from = point.from;
        this.to = point.to;
        this.transport = {
            type : point.type,
            seat: point.seat,
            gate: point.gate,
            baggage: point.baggage,
            number: point.number
        };
    }

    function createLinks(obj){
        var thisItem,
            nextItem;
        for(thisItem in obj){
            for(nextItem in obj){
                if(obj[thisItem].to === obj[nextItem].name){
                    obj[thisItem].to = obj[nextItem];
                };
                if(obj[thisItem].from === obj[nextItem].name){
                    obj[thisItem].from = obj[nextItem];
                };
                if(obj[thisItem].from === null){
                    obj.first = obj[thisItem];
                };
                if(obj[thisItem].to === null){
                    obj.last = obj[thisItem];
                };
            };
        };
        return obj;
    }

    function createCollection(arr){
        var collection = {};
        for(var i = 0; i < arr.length; i++){
            var item = arr[i];
            collection[item.name] = new Waypoint(item);
        }

        return collection;
    }

    function createNode(itemTag, itemTagClassName){
        var item  = document.createElement(itemTag);
        item.className = itemTagClassName;
        return item;
    }


    function printRoute(obj, wrap){
        var cnt = obj.first,
            wrapper = document.getElementById(wrap),
            node = createNode(itemTag, itemTagClassName),
            type,
            number,
            name,
            seat,
            gate,
            baggage,
            nextRouteName,
            cloneNode,
            msg = '';

        while(cnt){
            type = cnt.transport.type;
            number = cnt.transport.number;
            name = cnt.name;
            seat = cnt.transport.seat;
            gate = cnt.transport.gate;
            baggage = cnt.transport.baggage;
            cloneNode = node.cloneNode(false);
            if(cnt.to){
                nextRouteName = cnt.to.name ;
            } else {
                break;
            }

            if(type === 'train'){
                msg = 'Take train '+ number +' from '+ name +' to ' + nextRouteName + '. Seat ' + seat +'.';
            } else if(type === 'bus'){
                msg = 'Take the airport bus from '+ name +' to ' + nextRouteName + '. ' + seat +'.';
            } else if(type === 'aircraft'){
                msg = 'From '+ name +', take flight '+ number +' to ' + nextRouteName + '. Gate '+ gate +'.'+ ' Seat ' + seat +'. ' + baggage + '.';
            } else {
                msg = 'Please add the type of transport.'
            }
            cloneNode.innerHTML = msg;
            wrapper.appendChild(cloneNode);
            cnt = cnt.to;
        }
    }

    collection = createCollection(cards);
    obj = createLinks(collection);
    printRoute(obj, containerIdSelector);
})(cards, opt);

