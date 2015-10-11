/*!
* Tally Input Control v1.0 (jQuery Plugin)
* (c) Asylum Hill Software, LLC
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

(function ($) {
    'use strict';
    
    var tallyItem = function (textValue, idValue) {
        this.text = textValue;
        this.elementId = idValue;
        this.removeElementId =  idValue + '_remove';
    };
    
    var tallyType = {
       none: { name: "NONE", regex: null },
       email: { name: "EMAIL", regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i },
       hashtag: { name: "HASHTAG", regex: /(#?)([a-z\d-]+)/ig },
       regex: { name: "REGEX", regex: "" },
    };
    
    $.fn.tally = function (options) {
        this.name = "TallyInputControlV1";
        this.items = [];
        this.index = 1;
        this.type = tallyType.none;
        this._lastInputText = "";
        this._lastKeyCode = null;
        this._tripKeyCodes = [13, 32, 44, 59];
        this._tripDeleteKeyCodes = [8, 127];
        this._wrapperElementId = "";
        this._itemCounter = 0;

        this._init = function () {
            this._createWrapper();
            this._bindChangeTracking();
        }

        this._bindChangeTracking = function () {
            this.bind('keypress', (function (e) {
                this._lastKeyCode = e.keyCode;
                console.log("KEYPRESS", this._lastKeyCode);

                if (this._tripKeyCodes.indexOf(this._lastKeyCode) > -1) {
                    this._processTrippedText(this.getValue());
                    return false;
                }
                
            }).bind(this));

            this.bind('keyup', (function (e) {
                this._lastKeyCode = e.keyCode;
                console.log("KEYUP", this._lastKeyCode);

                if (this._tripDeleteKeyCodes.indexOf(this._lastKeyCode) > -1) {
                    this._processTrippedTextBackspace(this._lastInputText);
                }

                this._lastInputText = this.val();
            }).bind(this));
        };

        this._unbindChangeTracking = function () {
            this.unbind('keypress');
            this.unbind('keyup');
        };

        this._processTrippedTextBackspace = function (inputText) {
            // if empty and backspace hit delete
            if ((!inputText || inputText <= "") &&
                (this.items && this.items.length > 0)) {
                this.removeItem(this.items[this.items.length-1].elementId);
            }
        };

        this._processTrippedText = function (inputText) {
            if (!inputText) return;

            if (inputText && inputText != "" && inputText.length >= settings.minLength
                && (this.type == tallyType.none || this.type.regex.test(inputText))) {
                this.insertItem.call(this, inputText);

                this.setValue("");
            }
        };
        
        this.setType = function (value) {
            if (value == undefined || value == null) return;
            
            switch(value.toUpperCase()){
                case tallyType.email.name: 
                    this.type = tallyType.email;
                    break;
                case tallyType.hashtag.name:
                    this.type = tallyType.hashtag;
                    break;
                case tallyType.regex.name:
                    this.type = tallyType.regex;
                    break;
                default:
                    this.type = tallyType.none;
                    break;
            }
        };
        
        this.setValue = function (value) {
            this._unbindChangeTracking();
            this.val(value)
            this._bindChangeTracking();
            return value;
        };

        this.getValue = function (value) {
            return this.val().trim();
        };

        this.insertItem = function (itemText) {
            this._itemCounter += 1;
            var item = new tallyItem(itemText, this._wrapperElementId + '_' + this._itemCounter);
            this.items.push(item);
            this._createItem(item);
        }

        // TODO: Create overloads on how to delete items
        this.removeItem = function (elementId) {
            var index = -1;
            var foundIndex = -1;

            var item = $.grep(this.items, function (e) {
                index += 1;
                if (e.elementId == elementId) {
                    foundIndex = index;
                    return true;
                }
                return false;
            });

            if (typeof item != undefined && item != null) {
                $('#' + elementId).remove();
                this.items.splice(foundIndex, 1);
                this.focus();
            }
        }

        this._createItem = function (item) {
            var deleteElement = $("<div id=\"" + item.elementId + "_remove\">x</div>").css({
                position: "absolute",
                right: ".25em",
                bottom: "2px",
                fontSize: ".95em",
                color: settings.removeColor,
                cursor: "pointer",
                paddingLeft: "5px",
                paddingRight: "2px"
            });

            var itemElement =
            $("<div id=\"" + item.elementId + "\">" + item.text + "</div>").css({
                display: "inline-block",
                position: "relative",
                marginRight: "10px",
                backgroundColor: settings.itemBackgroundColor,
                borderRadius: settings.itemBorderRadius,
                borderColor: settings.itemBorderColor,
                borderStyle: settings.itemBorderStyle,
                borderWidth: settings.itemBorderWidth,
                color: settings.color,
                paddingLeft: ".5em",
                paddingRight: "1.35em",
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: settings.fontSize,
                textOverflow: "ellipsis",
                maxWidth: settings.maxItemWidth,
                overflow: "hidden"
            });
            deleteElement.appendTo(itemElement);

            itemElement.insertBefore(this);

            // wire up remove click
            deleteElement.bind('click', (function (e) {
                this.removeItem.call(this, item.elementId);
            }).bind(this));
        };

        this._createWrapper = function () {
            this._wrapperElementId = "tally_control_wrapper_" + this.index;
            if (!($('#' + this._wrapperElementId).length)) {
                var wrapper = $("<div id=\"" + this._wrapperElementId + "\"></div>");
                wrapper.css({
                    padding: "10px",
                    backgroundColor: settings.backgroundColor,
                    borderColor: settings.borderColor,
                    borderWidth: settings.borderWidth,
                    borderStyle: settings.borderStyle,
                    fontFamily: settings.fontFamily,
                    fontSize: settings.fontSize,
                    minWidth: settings.inputWidth,
                });
                this.wrap(wrapper);
            }
        };

        // set default options
        var settings = $.extend({
            // These are the defaults.
            color: "#000",
            removeColor: "#aaa",
            backgroundColor: "#fff",
            itemBackgroundColor: "#ddd",
            itemBorderRadius: "5px",
            itemBorderColor: "#ddd",
            itemBorderStyle: "none",
            itemBorderWidth: "0px",
            fontSize: "14px",
            maxItemWidth: "175px",
            fontFamily: "Sans-Serif",
            borderColor: "#ddd",
            borderWidth: "1px",
            borderStyle: "solid",
            backgroundColor: "#fff",
            minLength: 2,
            inputWidth: "175px",
        }, options );
        
        // wire up control
        this._init();

        // set default style
        return this.css({
            display: "inline-block",
            position: "relative",
            backgroundColor: settings.backgroundColor,
            border: "none",
            outline: "none",
            fontFamily: settings.fontFamily,
            margin: "0px",
            paddingTop: "5px",
            paddingBottom: "5px",
            width: settings.inputWidth,
            verticalAlign: "top",
            fontSize: settings.fontSize,
            color: settings.color,
            backgroundColor: settings.backgroundColor
        });
 
    };
 
}( jQuery ));