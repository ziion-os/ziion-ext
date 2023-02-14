// LibAdwaita + GTK based preference or newer versions of GNOME

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Constants = Me.imports.constants;
const { Adw, Gtk, Gdk, Gio, GLib, GObject } = imports.gi;

// Create all the customization options
var ZIIONextOptionsWidget = GObject.registerClass(class ZIIONext_OptionsWidget extends Adw.PreferencesPage {
    _init(settings, IconGrid) {
        super._init({
            margin_top: 24,
            margin_start: 24,
            margin_bottom: 24,
            margin_end: 24,
        });
        this._settings = settings;
        this.set_title('Preferences');
        this.set_name('Preferences');
        this.set_icon_name('emblem-system-symbolic');

        let iconGroup = new Adw.PreferencesGroup({
            title: "Icon Settings"
        });

        let prefGroup1 = new Adw.PreferencesGroup({
            title: "Change Defaults"
        });

        let prefGroup2 = new Adw.PreferencesGroup({
            title: "Show/Hide Options"
        });
        // Rows

        // Icons

        let iconsRow = new Adw.ActionRow({
            title: "Icon"
        });

        let iconsFlowBox = new IconGrid();
        iconsFlowBox.connect('child-activated', () => {
            let selectedChild = iconsFlowBox.get_selected_children();
            let selectedChildIndex = selectedChild[0].get_index();
            this._settings.set_int('menu-button-icon-image', selectedChildIndex);
        });
        Constants.DistroIcons.forEach((icon) => {
            let iconName = icon.PATH.replace("/Resources/", '');
            iconName = iconName.replace(".svg", '');
            let iconImage = new Gtk.Image({
                icon_name: iconName,
                pixel_size: 36
            });
            iconsFlowBox.add(iconImage);
        });

        iconsRow.add_suffix(iconsFlowBox);

        let children = iconsFlowBox.childrenCount;
        for (let i = 0; i < children; i++) {
            if (i === this._settings.get_int('menu-button-icon-image')) {
                iconsFlowBox.select_child(iconsFlowBox.get_child_at_index(i));
                break;
            }
        }

        // Icon Size Scale

        let menuButtonIconSizeRow = new Adw.ActionRow({
            title: "Icon Size"
        });

        let iconSize = this._settings.get_int('menu-button-icon-size');

        let menuButtonIconSizeScale = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            adjustment: new Gtk.Adjustment({
                lower: 14,
                upper: 64,
                step_increment: 1,
                page_increment: 1,
                page_size: 0
            }),
            digits: 0,
            round_digits: 0,
            hexpand: true,
            draw_value: true,
            value_pos: Gtk.PositionType.RIGHT
        });

        menuButtonIconSizeScale.set_format_value_func((scale, value) => {
            return "\t" + value + "px";
        });

        menuButtonIconSizeScale.set_value(iconSize);
        menuButtonIconSizeScale.connect('value-changed', () => {
            this._settings.set_int('menu-button-icon-size', menuButtonIconSizeScale.get_value());
        });

        menuButtonIconSizeRow.add_suffix(menuButtonIconSizeScale);

        //iconGroup
        iconGroup.add(iconsRow);
        iconGroup.add(menuButtonIconSizeRow)

        this.add(iconGroup);

        // Activities click type

        let clickType = this._settings.get_int('menu-button-icon-click-type');
        let menuButtonIconClickTypeRow = new Adw.ActionRow({
            title: "Icon Click Type to open Activities"
        });

        let menuButtonIconClickTypeCombo = new Gtk.ComboBoxText({
            valign: Gtk.Align.CENTER
        });
        menuButtonIconClickTypeCombo.append("1", "Left Click ");
        menuButtonIconClickTypeCombo.append("2", "Middle Click ");
        menuButtonIconClickTypeCombo.append("3", "Right Click ");
        menuButtonIconClickTypeCombo.set_active_id(clickType.toString());

        menuButtonIconClickTypeCombo.connect('changed', () => {
            this._settings.set_int('menu-button-icon-click-type', parseInt(menuButtonIconClickTypeCombo.get_active_id()));
        });

        menuButtonIconClickTypeRow.add_suffix(menuButtonIconClickTypeCombo);

        // Extensions application choice

        let extensionApp = this._settings.get_string('menu-button-extensions-app');
        let menuButtonExtensionsAppRow = new Adw.ActionRow({
            title: "Preferred Extensions Application"
        });

        let menuButtonExtensionsAppCombo = new Gtk.ComboBoxText({
            valign: Gtk.Align.CENTER
        });
        menuButtonExtensionsAppCombo.append("org.gnome.Extensions.desktop", "GNOME Extensions");
        menuButtonExtensionsAppCombo.append("com.mattjakeman.ExtensionManager.desktop", "Extensions Manager");
        menuButtonExtensionsAppCombo.set_active_id(extensionApp.toString());

        menuButtonExtensionsAppCombo.connect('changed', () => {
            this._settings.set_string('menu-button-extensions-app', menuButtonExtensionsAppCombo.get_active_id());
        });

        menuButtonExtensionsAppRow.add_suffix(menuButtonExtensionsAppCombo);

        // Choose Terminal

        let menuButtonTerminalRow = new Adw.ActionRow({
            title: "Terminal"
        });

        // Change Terminal and build it's option in prefs
        let currentTerminal = this._settings.get_string('menu-button-terminal');

        let changeTerminalInput = new Gtk.Entry({
            valign: Gtk.Align.CENTER,
        });

        changeTerminalInput.set_text(currentTerminal);
        changeTerminalInput.connect('changed', () => {
            this._settings.set_string('menu-button-terminal', changeTerminalInput.get_text());
        });

        menuButtonTerminalRow.add_suffix(changeTerminalInput);

        // Change Software Center and build it's option in prefs

        let menuButtonSCRow = new Adw.ActionRow({
            title: "Software Center"
        });
        let currentSoftwareCenter = this._settings.get_string('menu-button-software-center');

        let changeSoftwareCenterInput = new Gtk.Entry({
            valign: Gtk.Align.CENTER,
        });

        changeSoftwareCenterInput.set_text(currentSoftwareCenter);
        changeSoftwareCenterInput.connect('changed', () => {
            this._settings.set_string('menu-button-software-center', changeSoftwareCenterInput.get_text());
        });

        menuButtonSCRow.add_suffix(changeSoftwareCenterInput);


        // Power Options
        let showPowerOptionsRow = new Adw.ActionRow({
            title: "Enable Power Options"
        });
        let showPowerOptionsSwitch = new Gtk.Switch({
            valign: Gtk.Align.CENTER
        });

        showPowerOptionsSwitch.set_active(this._settings.get_boolean('show-power-options'));
        showPowerOptionsSwitch.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-power-options', widget.get_active());
        });

        showPowerOptionsRow.add_suffix(showPowerOptionsSwitch);

        // Toggle Force Quit option and build it's option in prefs
        let forceQuitOptionrow = new Adw.ActionRow({
            title: "Hide Force Quit option"
        });

        let showFQOptionsSwitch = new Gtk.Switch({
            valign: Gtk.Align.CENTER,
        });

        showFQOptionsSwitch.set_active(this._settings.get_boolean('hide-forcequit'));
        showFQOptionsSwitch.connect('notify::active', (widget) => {
            this._settings.set_boolean('hide-forcequit', widget.get_active());
        });

        forceQuitOptionrow.add_suffix(showFQOptionsSwitch);


        // Toggle Lock Screen option and build it's option in prefs
        let lockScreenOptionRow = new Adw.ActionRow({
            title: "Show Lock Screen option"
        });

        let showLCOptionsSwitch = new Gtk.Switch({
            valign: Gtk.Align.CENTER,
        });

        showLCOptionsSwitch.set_active(this._settings.get_boolean('show-lockscreen'));
        showLCOptionsSwitch.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-lockscreen', widget.get_active());
        });

        lockScreenOptionRow.add_suffix(showLCOptionsSwitch);

        // Toggle Software centre option and build it's option in prefs
        let softwareCentreOptionRow = new Adw.ActionRow({
            title: "Hide Software Centre option"
        });

        let hideSCOptionSwitch = new Gtk.Switch({
            valign: Gtk.Align.CENTER,
        });

        hideSCOptionSwitch.set_active(this._settings.get_boolean('hide-softwarecentre'));
        hideSCOptionSwitch.connect('notify::active', (widget) => {
            this._settings.set_boolean('hide-softwarecentre', widget.get_active());
        });

        softwareCentreOptionRow.add_suffix(hideSCOptionSwitch);

        // Pref Group
        prefGroup1.add(menuButtonIconClickTypeRow);
        prefGroup1.add(menuButtonExtensionsAppRow);
        prefGroup1.add(menuButtonTerminalRow);
        prefGroup1.add(menuButtonSCRow);

        prefGroup2.add(showPowerOptionsRow);
        prefGroup2.add(forceQuitOptionrow);
        prefGroup2.add(lockScreenOptionRow);
        prefGroup2.add(softwareCentreOptionRow);

        this.add(prefGroup1);
        this.add(prefGroup2);
    }
})


function fillPrefsWindow(window, IconGrid, Settings) {
    let options = new ZIIONextOptionsWidget(Settings, IconGrid);

    let iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default());
    if (!iconTheme.get_search_path().includes(Me.path + "/Resources"))
        iconTheme.add_search_path(Me.path + "/Resources");

    window.add(options);
    window.search_enabled = true;
}
