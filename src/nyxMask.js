/**
 * ngMask
 *
 * @author Douglas Lira <douglas.lira.web@gmail.com>
 * @url https://github.com/douglaslira/ngmask/
 */

(function () {
    'use strict';

    angular.module('NyXJS', [])
        .factory('maskCheck', maskCheck)
        .directive('nyxMask', nyxMask);

    maskCheck.$inject = [];

    function maskCheck() {
        return {
            new: function (m, v) {

                if (m == '###.###.###-##|##.###.###/####-##') {
                    if (v.length > 14) {
                        return maskID.new('##.###.###/####-##', v);
                    } else {
                        return maskID.new('###.###.###-##', v);
                    }
                }

                if (m == '## ####-####|## #####-####') {
                    if (v.length > 12) {
                        return maskID.new('## #####-####', v);
                    } else {
                        return maskID.new('## ####-####', v);
                    }
                }

                var tv = "";
                var ret = "";
                var character = "#";
                var separator = "|";
                var maskUse = "";
                v = maskID.empty(v);
                if (v == "") {
                    return v
                }
                ;
                var temp = m.split(separator);
                var dif = 1000;

                var vm = v;
                // removing the mask value existing
                for (var i = 0; i < v.length; i++) {
                    if (!isNaN(v.substr(i, 1))) {
                        tv = tv + v.substr(i, 1);
                    }
                }

                v = tv;

                // dynamic format mask
                for (var i = 0; i < temp.length; i++) {
                    var mult = "";
                    var validate = 0;
                    for (var j = 0; j < temp[i].length; j++) {
                        if (temp[i].substr(j, 1) == "]") {
                            temp[i] = temp[i].substr(j + 1);
                            break;
                        }
                        if (validate == 1)mult = mult + temp[i].substr(j, 1);
                        if (temp[i].substr(j, 1) == "[")validate = 1;
                    }
                    for (var j = 0; j < v.length; j++) {
                        temp[i] = mult + temp[i];
                    }
                }

                // check which masks use
                if (temp.length == 1) {
                    maskUse = temp[0];
                    var cleanMask = "";
                    for (var j = 0; j < maskUse.length; j++) {
                        if (maskUse.substr(j, 1) == character) {
                            cleanMask = cleanMask + character;
                        }
                    }
                    var tam = cleanMask.length;
                } else {
                    // clean different characters of the character of the mask
                    for (var i = 0; i < temp.length; i++) {
                        var cleanMask = "";
                        for (var j = 0; j < temp[i].length; j++) {
                            if (temp[i].substr(j, 1) == character) {
                                cleanMask = cleanMask + character;
                            }
                        }
                        if (v.length > cleanMask.length) {
                            if (dif > (v.length - cleanMask.length)) {
                                dif = v.length - cleanMask.length;
                                maskUse = temp[i];
                                tam = cleanMask.length;
                            }
                        } else if (v.length < cleanMask.length) {
                            if (dif > (cleanMask.length - v.length)) {
                                dif = cleanMask.length - v.length;
                                maskUse = temp[i];
                                tam = cleanMask.length;
                            }
                        } else {
                            maskUse = temp[i];
                            tam = cleanMask.length;
                            break;
                        }
                    }
                }

                // validating mask size according to the size of the value
                if (v.length > tam) {
                    v = v.substr(0, tam);
                } else if (v.length < tam) {
                    var masct = "";
                    var j = v.length;
                    for (var i = maskUse.length - 1; i >= 0; i--) {
                        if (j == 0) break;
                        if (maskUse.substr(i, 1) == character) {
                            j--;
                        }
                        masct = maskUse.substr(i, 1) + masct;
                    }
                    maskUse = masct;
                }

                // Apply mask
                j = maskUse.length - 1;
                for (var i = v.length - 1; i >= 0; i--) {
                    if (maskUse.substr(j, 1) != character) {
                        ret = maskUse.substr(j, 1) + ret;
                        j--;
                    }
                    ret = v.substr(i, 1) + ret;
                    j--;
                }
                return ret;
            },

            empty: function (v) {
                var vclean = "";
                var len = v.length;
                for (var i = 0; i < 30; i++) {
                    if (v.substr(i, 1) == " ") {
                    } else {
                        vclean = vclean + v.substr(i, 1);
                    }
                }
                return vclean;
            }
        };
    }

    nyxMask.$inject = ['maskCheck'];

    function nyxMask(maskCheck) {

        return {
            restrict: 'A',
            scope: {
                ngModel: '=',
                mask: '@',
                valueMax: '@'
            },
            link: function (scope, elem, attrs) {
                var newMask = (!scope.mask ? '[#]' : scope.mask);
                var newCheck = (!scope.valueMax ? "" : parseFloat(scope.valueMax.replace('.', '').replace(',', '')));
                scope.ngModel = maskCheck.new(newMask, scope.ngModel.replace('.', ''));
                if (scope.ngModel) {
                    scope.ngModel = maskCheck.new(newMask, scope.ngModel);
                }
                elem.bind("keyup", function () {
                    scope.$apply(function () {
                        scope.ngModel = maskCheck.new(newMask, scope.ngModel);
                        var newValue = parseFloat(scope.ngModel.replace('.', '').replace(',', ''));
                        if (newCheck) {
                            if (newValue > newCheck) {
                                scope.ngModel = maskCheck.new(newMask, scope.valueMax);
                            }
                        } else {
                            scope.ngModel = maskCheck.new(newMask, scope.ngModel);
                        }
                    });
                });
            }
        }

    }

});