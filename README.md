NGMask By Douglas Lira
=================

This directive was created to apply mascara on input values.

## How to use ng-mask - Basic

* nyx-mask ng-model="model"

## Format mask

* nyx-mask ng-model="model" mask="##,##"

## Limit values with ng-mask

* nyx-mask ng-model="model" mask="##,##" value-max="10,11"

## Mask for currency values

* nyx-mask ng-model="model" mask="[.###],##"

## CPF or CNPJ

* nyx-mask ng-model="model" mask="###.###.###-##|##.###.###/####-##"

## Phone (8 or 9 digits)

* nyx-mask ng-model="model" mask="## ####-####|## #####-####"

## Attention!!

* 1 - By default the nyx-mask defines a maximum of 30 characters
* 2 - It is compulsory to wear ng-model
