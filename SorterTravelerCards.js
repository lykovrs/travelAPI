/**
 * @author Lykov Roman
 *
 * Сортирует и выводит на экран посадочные карточки для различных видов транспорта
 * @constructor
 * @this {Sorter}
 * @param {object} arr Исходный json массив с посадочными карточками.
 * @param {object} opt Объект с параметрами.
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

    var containerIdSelector = options.selector,
        itemTag = options.itemTag,
        itemTagClassName = options.itemTagClassName,
        cards = options.cards,
        collection = {};

    /**
     * Создает экземпляр Waypoint.
     *
     * @constructor
     * @param {object} point Объект точки маршрута.
     */
    function Waypoint(point){
        this.name = point.name;
        this.nextRouteName = point.to;
        this.from = point.from;
        this.to = point.to;
        this.type  = point.type;
        this.seat = point.seat;
        this.gate = point.gate;
        this.baggage = point.baggage;
        this.number = point.number;

    }

    /**
     * Создает коллекцию объектов из карточек.
     *
     * @param {object} arr Исходный массив с карточками.
     */
    function createCollection(arr){
        for(var i = 0; i < arr.length; i++){
            var item = arr[i];
            collection[item.name] = new Waypoint(item);
        }
    }

    /**
     * Устанавливает ссылки в коллекцию объектов, определяя последовательность, начальную и конечные точки.
     *
     * @param {object} obj Коллекция объектов, созданных из массива с карточками.
     * @return {object} obj Модифицирует коллекцию.
     */
    function createLinks(obj){
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
    }

    /**
     * Создает элемент DOM для последующей вставки.
     *
     * @param {string} itemTag Тип элемента.
     * @param {string} itemTagClassName Имя класса элемента.
     * @return {object} node DOM-элемент.
     */
    function createNode(itemTag, itemTagClassName){
        var node  = document.createElement(itemTag);
        node.className = itemTagClassName;
        return node;
    }

    var templates = {
        train: 'Take train {number} from {name} to {nextRouteName}. Seat {seat}.',
        'bus': 'Take the airport bus from {name} to {nextRouteName}. {seat}.',
        'aircraft': 'From {name}, take flight {number} to {nextRouteName}. Gate {gate} Seat {seat}. {baggage}.'

    };

    /**
     * Создает текстовый шаблон в зависимости от типа транспорта.
     *
     * @param {string} template Шаблон текста для заполнения.
     * @param {object} card Крточка-объект точки маршрута.
     */

    function applyTemplate(template, card) {
        return Object.keys(card).reduce(function(pref, field) {
            return pref.replace('{' + field + '}', card[field]);
        }, template);
    }


    /**
     * Проходит по объектам
     * Выводит маршрут в заданную позицию DOM, в соответствии с типом маршрута.
     *
     * @param {object} col Коллекция карточек.
     */
    function printRoute(col){
        var cnt = col.first,
            wrapper = document.getElementById(containerIdSelector),
            node = createNode(itemTag, itemTagClassName),
            nextRouteName,
            cloneNode;

        while(cnt){
            if(cnt.to){
                nextRouteName = cnt.to.name;
            } else {
                break;
            }

            cloneNode = node.cloneNode(false);
            cloneNode.innerHTML = applyTemplate(templates[cnt.type], cnt);
            wrapper.appendChild(cloneNode);
            cnt = cnt.to;
        }
    }

    /**
     * Метод, запускающий процесс сортировки и вывода на экран.
     */
    this.run = function(){
        createCollection(cards);
        createLinks(collection);
        printRoute(collection);
    };

};


