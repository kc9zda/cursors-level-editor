## Cursors Level Editor

This page/utility allows the user to create cursors.io levels. There are no abilities to export the map yet, as I need to find a suitable format. I will support my JSON format for my Node.js cursors server, in the near future

### How to use the editor

The buttons at the top are toggle buttons and are bolded when enabled. When no buttons are bolded, the edit tool is enabled.

#### Spawn

Click anywhere on the map to move the spawn point. The spawn point is shown as a blue star on the map.

#### Text

Click anywhere on the map to place the BOTTOM LEFT corner of the text. The text can be edited with the edit tool

#### Wall

Click and drag the mouse to define the wall. An outline will appear depicting the wall. Color can be changed with the edit tool.

#### Exit

Click and drag the mouse to define the exit. Destination map can be changed with the edit tool

#### Trigger 

Click and drag the mouse to define the trigger (pressure plate). Color, and count can be changed with the edit tool.

#### Button

Click and drag the mouse to define the button. Color, and count can be changed with the edit tool.

#### Export

Currently supports 2 formats, kc9zda and eldit, for each of their servers, as they have a slightly different map format. See zdalvlformat.txt for the kc9zda level format.

#### Edit

Click on the map, and the side panel should have all objects that are at the location of the click. Objects update upon changing fields.

### Installation

Simply clone or download the repository, then navigate to index.html. This will work without a webserver, just go to your file explorer and open index.html.
