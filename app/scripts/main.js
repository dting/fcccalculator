'use strict';

var app = angular.module('CalculatorApp', ['ngMaterial']);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
    .accentPalette('red')
    .warnPalette('green');
});

app.constant('OPERATORS', {
  '%': true,
  '*': true,
  '/': true,
  '+': true,
  '-': true
});

app.controller('AppCtrl', function(OPERATORS) {
  var vm = this;
  vm.display = '';
  vm.evalStr = '';

  vm.pressed = function(btn) {
    if (vm.display === 'Error') vm.display = '';
    if (isOperator(btn)) {
      if ((isOperator(vm.display) ||
           (vm.display === '' && vm.evalStr === '') ||
           (vm.display === '' && isOperator(vm.evalStr.slice(-1))))) {
        return;
      }
      if (vm.display !== '') vm.display = (vm.display * 1).toString();
      if (vm.display.substring(0, 1) === '-') {
        vm.evalStr += '\(' + vm.display + '\)';
      } else {
        vm.evalStr += vm.display;
      }
      vm.display = btn;
      vm.isResult = false;
    } else {
      if (vm.display === '' && vm.evalStr && !isOperator(vm.evalStr.slice(-1))) return;
      if (isOperator(vm.display)) {
        vm.evalStr += vm.display;
        vm.display = btn;
      } else if (vm.display === '0' || vm.display === '') {
        vm.display = btn;
      } else if (vm.isResult) {
        vm.display = btn;
      } else {
        vm.display += btn;
      }
      vm.isResult = false;
    }
  };

  vm.decimal = function() {
    if (isOperator(vm.display)) return;
    if (vm.isResult || vm.display === '') {
      vm.display = '0.';
    } else if (!/\./g.test(vm.display)) {
      vm.display += '.';
    }
    vm.isResult = false;
  };

  vm.allClear = function() {
    vm.display = '';
    vm.evalStr = '';
    vm.isResult = false;
  };

  vm.clearEntry = function() {
    vm.display = '';
    vm.isResult = false;
  };

  vm.equals = function() {
    if (isOperator(vm.display)) return;
    if (vm.display.substring(0, 1) === '-') {
      vm.evalStr += '\(' + vm.display + '\)';
    } else {
      vm.evalStr += vm.display;
    }
    try {
      vm.display = eval(vm.evalStr) + '';
    } catch (e) {
      vm.display = 'Error';
    }
    vm.evalStr = '';
    vm.isResult = true;
  };

  vm.negate = function() {
    if (isOperator(vm.display) || vm.display === '') return;
    if (vm.display[0] === '-') {
      vm.display = vm.display.substring(1);
    } else {
      vm.display = '-' + vm.display;
    }
  };

  function isOperator(btn) {
    return OPERATORS.hasOwnProperty(btn);
  }
});
