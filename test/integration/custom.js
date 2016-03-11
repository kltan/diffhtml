import * as diff from '../../lib/index.js';
import validateMemory from '../util/validateMemory';

describe('Integration: Custom Elements', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();

    validateMemory();
  });

  it('cannot register over an existing component', function() {
    diff.registerElement('custom-element-two', {});

    assert.throws(function() {
      diff.registerElement('custom-element-two', {});
    });
  });

  it('can trigger the createdCallback', function() {
    var callbackTriggered = false;

    diff.registerElement('custom-element-three', {
      createdCallback: function() {
        callbackTriggered = true;
      }
    });

    diff.innerHTML(this.fixture, '<custom-element-three></custom-element-three>');

    assert.ok(callbackTriggered, 'createdCallback was called');
  });

  it('can trigger the attachedCallback', function() {
    var callbackTriggered = false;

    diff.registerElement('custom-element-four', {
      attachedCallback: function() {
        callbackTriggered = true;
      }
    });

    diff.innerHTML(this.fixture, '<custom-element-four></custom-element-four>');

    document.body.appendChild(this.fixture);

    assert.ok(callbackTriggered, 'attachedCallback was called');

    document.body.removeChild(this.fixture);
  });

  it('can call a custom method', function() {
    var callbackTriggered = false;

    diff.registerElement('custom-element-five', {
      getValue: function() {
        return true;
      },

      attachedCallback: function() {
        callbackTriggered = this.getValue();
      }
    });

    diff.innerHTML(this.fixture, '<custom-element-five></custom-element-five>');

    document.body.appendChild(this.fixture);

    assert.ok(callbackTriggered, 'getValue was called');

    document.body.removeChild(this.fixture);
  });

  it('supports the `is` attribute', function() {
    var callbackTriggered = false;

    diff.registerElement('extended-div', {
      extends: 'div',

      prototype: {
        createdCallback: function() {
          callbackTriggered = true;
        }
      }
    });

    diff.innerHTML(this.fixture, '<div is="extended-div"></div>');

    document.body.appendChild(this.fixture);

    assert.ok(callbackTriggered, 'createdCallback was called');

    document.body.removeChild(this.fixture);
  });

  it('can activate previously attached elements', function() {
    var callbackTriggered = false;

    diff.registerElement('extended-div-two', {
      extends: 'div',

      prototype: {
        attachedCallback: function() {
          callbackTriggered = true;
        }
      }
    });

    // Clear the children for this specific test.
    this.fixture.innerHTML = '';

    document.body.appendChild(this.fixture);

    diff.innerHTML(this.fixture, '<div is="extended-div-two"></div>');

    assert.ok(callbackTriggered, 'attachedCallback was called');

    document.body.removeChild(this.fixture);
  });

  it('can activate previously attached elements by attribute', function() {
    var callbackTriggered = false;

    diff.registerElement('extended-div-three', {
      extends: 'div',

      prototype: {
        attachedCallback: function() {
          callbackTriggered = true;
        }
      }
    });

    document.body.appendChild(this.fixture);

    diff.innerHTML(this.fixture, '<div is="extended-div-three"></div>');

    assert.ok(callbackTriggered, 'attachedCallback was called');

    document.body.removeChild(this.fixture);
  });
});
