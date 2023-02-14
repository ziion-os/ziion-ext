install:
	gnome-extensions pack --extra-source=Resources/ --extra-source=PrefsLib/ --extra-source=constants.js  --force
	gnome-extensions install ziion@halborn.com.shell-extension.zip --force
	rm ziion@halborn.com.shell-extension.zip
