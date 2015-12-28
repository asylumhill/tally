// JavaScript source code
var assert = chai.assert;

describe('TallyStructure', function () {
    var tally = null;

    beforeEach(function () {
        tally = new $('#testControl').tally({ minLength: 3 });
    });

    afterEach(function () {
        // strip out added html
        tally.unwrap();
        $("[id^='tally_control_wrapper_']").remove();
    });

    describe('#BasicProperties', function () {
        it('should have initial property of Items', function () {
            assert.ok(typeof tally != undefined && tally != null)
            assert.ok(typeof tally.items != undefined)
            assert.ok(typeof tally._lastKeyCode != undefined)
            assert.ok(typeof tally.text != undefined)
        });
    });

    describe('#BasicBehaivors', function () {
        it ('should capture the key press event', function () {
            tally.trigger($.Event('keydown', { keyCode: 84 }));
            console.log("Last key code", tally._lastKeyCode);
            assert.ok(tally._lastKeyCode == 84);
        });

        it('should consider complete when space', function () {
            tally.setValue("TEST1");
            tally.trigger($.Event('keydown', { keyCode: 32 })); // space
            assert.ok(tally.items[0].text == "TEST1");
        });

        it('should consider complete when enter', function () {
            tally.setValue("TEST2");
            tally.trigger($.Event('keydown', { keyCode: 13 })); // return
            assert.ok(tally.items[0].text == "TEST2");
        });
        
        it('should consider complete when tab', function () {
            tally.setValue("TEST3");
            tally.trigger($.Event('keydown', { keyCode: 9 })); // return
            assert.ok(tally.items[0].text == "TEST3");
        });
        
        it('should consider complete when comma entered', function () {
            tally.setValue("TEST4");
            tally.trigger($.Event('keydown', { keyCode: 44 })); // ,
            assert.ok(tally.items[0].text == "TEST4");
        });

        it('should consider complete when semi-colon entered', function () {
            tally.setValue("TEST5");
            tally.trigger($.Event('keydown', { keyCode: 59 })); // ;
            assert.ok(tally.items[0].text == "TEST5");
        });
        
        it('should consider complete when blurred', function () {
            // Was not able to quickly write a test for this scenerio
            // can be manually tested using spec.ui.html
        });
        
        it('should clear text when entered', function () {
            tally.setValue("TEST6");
            tally.trigger($.Event('keydown', { keyCode: 13 })); // return
            assert.ok(tally.val() == "");
        });

        it('when remove called DOM and item list should clear item', function () {
            tally.setValue("DELETETESTITEM");
            tally.trigger($.Event('keydown', { keyCode: 13 })); // return
            assert.ok(tally.items[0].text == "DELETETESTITEM");
            console.log(tally.items[0].elemendId);
            tally.removeItem(tally.items[0].elemendId);
            assert.ok(tally.items.length <= 0);
        });

        it('when remove middle item list should clear item even with multiple items', function () {
            tally.insertItem("DELETETESTITEM1");
            tally.insertItem("DELETETESTITEM2");
            tally.insertItem("DELETETESTITEM3");
            assert.ok(tally.items[0].text == "DELETETESTITEM1");
            assert.ok(tally.items[1].text == "DELETETESTITEM2");
            assert.ok(tally.items[2].text == "DELETETESTITEM3");
            tally.removeItem(tally.items[1].elementId);
            assert.ok(tally.items.length == 2);
            assert.ok(tally.items[0].text == "DELETETESTITEM1");
            assert.ok(tally.items[1].text == "DELETETESTITEM3");
        });

        it('backspace should remove last item added when no text', function () {
            tally.insertItem("DELETETESTITEM1");
            tally.insertItem("DELETETESTITEM2");
            tally.insertItem("DELETETESTITEM3");
            assert.ok(tally.items[0].text == "DELETETESTITEM1");
            assert.ok(tally.items[1].text == "DELETETESTITEM2");
            assert.ok(tally.items[2].text == "DELETETESTITEM3");
            tally.trigger($.Event('keyup', { keyCode: 8 })); // backspace
            assert.ok(tally.items.length == 2);
            assert.ok(tally.items[0].text == "DELETETESTITEM1");
            assert.ok(tally.items[1].text == "DELETETESTITEM2");
        });

        it('should not consider text complete when not enter, space, semi-colon, comma entered', function () {
            // negative test
            tally.setValue("TEST7");
            tally.trigger($.Event('keydown', { keyCode: 84 })); // ;
            assert.ok(tally.items.length == 0);
        });
        
        it('should not consider anything under minLength', function () {
            // negative test
            // minlength set to 3 in setup
            tally.setValue("TE");
            tally.trigger($.Event('keydown', { keyCode: 13 })); // return
            assert.ok(tally.items.length == 0);
        });
        
        it('should except email when email type', function () {
            // negative test
            tally.setValue("testingemailaddress@gmail.com");
            tally.setType('EMAIL');
            tally.trigger($.Event('keydown', { keyCode: 13 })); // return
            assert.ok(tally.items[0].text == "testingemailaddress@gmail.com");
        });
        
        it('should only except emails when email type', function () {
            // negative test
            tally.setValue("TESTNOTEMAIL");
            tally.setType('EMAIL');
            tally.trigger($.Event('keydown', { keyCode: 13 })); // return
            assert.ok(tally.items.length == 0);
        });
    });

    describe('#HTMLIsInPlace', function () {
        it ('should have a wrapper container and only 1', function () {
            assert.ok($('#' + tally._wrapperElementId).length);
            assert.ok($('#' + tally._wrapperElementId).length == 1);
        });

        it('in memory item & html item should be added after text is entered', function () {
            var startLength = tally.items.length;
            tally.setValue("TESTITEMS");
            tally.trigger($.Event('keydown', { keyCode: 32 })); // space
            assert.ok(startLength < tally.items.length);
            assert.ok($('#' + tally.items[0].elementId).length);
        });
    });
});