/**
 * @author Lykov Roman
 *
 * Сортирует и выводит на экран посадочные карточки для различных видов транспорта
 * @constructor
 * @this {Sorter}
 * @param {object} arr Исходный json массив с посадочными карточками.
 * @param {object} opt Объект с параметрами.
 * Расширить колличество шаблонов типов маршрутов возможно через свойство Sorter.template, набор параметров и типов маршрутов возможно через Sorter.Waypoint
 *
 */
'use strict';

function Sorter(arr, opt){
    var options = {
        selector: opt.selector,
        itemTag: opt.itemTag,
        itemTagClassName: opt.itemTagClassName,
        cards : arr
    };
        this.itemTag = options.itemTag;
        this.itemTagClassName = options.itemTagClassName;
        this.cards = options.cards;
        this.containerIdSelector = options.selector;
        this.mainObject = this;
        this.collection = {};

}

Sorter.prototype.templates = {
    'train': 'Take train {number} from {name} to {nextRouteName}. Seat {seat}.',
    'bus': 'Take the airport bus from {name} to {nextRouteName}. {seat}.',
    'aircraft': 'From {name}, take flight {number} to {nextRouteName}. Gate {gate} Seat {seat}. {baggage}.'
};

/**
 * Создает экземпляр Waypoint.
 *
 * @constructor
 * @param {object} point Объект точки маршрута.
 */
Sorter.prototype.Waypoint = function(point){
    this.name = point.name;
    this.nextRouteName = point.to;
    this.from = point.from;
    this.to = point.to;
    this.type  = point.type;
    this.seat = point.seat;
    this.gate = point.gate;
    this.baggage = point.baggage;
    this.number = point.number;
};

/**
 * Создает коллекцию объектов из карточек.
 *
 * @param {object} arr Исходный массив с карточками.
 */
Sorter.prototype.createCollection = function(arr){
    for(var i = 0; i < arr.length; i++){
        var item = arr[i];
        this.collection[item.name] = new this.Waypoint(item);
    }
};


/**
 * Устанавливает ссылки в коллекцию объектов, определяя последовательность, начальную и конечные точки.
 *
 * @param {object} obj Коллекция объектов, созданных из массива с карточками.
 * @return {object} obj Модифицирует коллекцию.
 */
Sorter.prototype.createLinks = function(obj){
    var thisItem,
        nextItem;
    for(thisItem in obj){
        for(nextItem in obj){
            if(obj[thisItem].to === obj[nextItem].name){
                obj[thisItem].to = obj[nextItem];
            }
            if(obj[thisItem].from === obj[nextItem].name){
                obj[thisItem].from = obj[nextItem];
            }
            if(obj[thisItem].from === null){
                obj.first = obj[thisItem];
            }
            if(obj[thisItem].to === null){
                obj.last = obj[thisItem];
            }
        }
    }
    return obj;
};

/**
 * Проходит по объектам
 * Выводит маршрут в заданную позицию DOM, в соответствии с типом маршрута.
 *
 * @param {object} col Коллекция карточек.
 */
Sorter.prototype.printRoute = function(col){
    var cnt = col.first,
        wrapper = document.getElementById(this.containerIdSelector),
        node = this.createNode(this.itemTag, this.itemTagClassName),
        nextRouteName,
        cloneNode;

    while(cnt){
        if(cnt.to){
            nextRouteName = cnt.to.name;
        } else {
            break;
        }

        cloneNode = node.cloneNode(false);
        cloneNode.innerHTML = this.applyTemplate(this.mainObject.templates[cnt.type], cnt);
        wrapper.appendChild(cloneNode);
        cnt = cnt.to;
    }
};

/**
 * Создает элемент DOM для последующей вставки.
 *
 * @param {string} itemTag Тип элемента.
 * @param {string} itemTagClassName Имя класса элемента.
 * @return {object} node DOM-элемент.
 */
Sorter.prototype.createNode = function(itemTag, itemTagClassName){
    var node  = document.createElement(itemTag);
    node.className = itemTagClassName;
    return node;
};

/**
 * Создает текстовый шаблон в зависимости от типа транспорта.
 *
 * @param {string} template Шаблон текста для заполнения.
 * @param {object} card Крточка-объект точки маршрута.
 */

Sorter.prototype.applyTemplate = function(template, card) {
    return Object.keys(card).reduce(function(pref, field) {
        return pref.replace('{' + field + '}', card[field]);
    }, template);
};

/**
 * Метод, запускающий процесс сортировки и вывода на экран.
 */
Sorter.prototype.run = function(){
    this.createCollection(cards);
    this.createLinks(this.collection);
    this.printRoute(this.collection);
};

