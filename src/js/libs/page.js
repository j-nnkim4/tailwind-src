var html = `
    <div id="errorNotification" class="menuCard" style="display:none">
        <div>
            It looks like MooMoo ran in to a problem. Please try <a target="_blank" href="https://www.computerhope.com/issues/ch001411.htm">disabling all of your browser extensions</a>
            and reloading the page.
        </div>
        <div style="text-align:center">
            <a onclick="errorNotification.style.display = 'none'" style="cursor:pointer">Hide</a>
        </div>
    </div>
    <div id="shutdownDisplay" hidden></div>
    <div id="mainMenu">
        <div id="menuContainer">
            <div id="gameName">MOOMOO.io</div>
            <div id="loadingText">Loading...</div>
            <div id="menuCardHolder" style="display:none">
                <div style="display:inline-block">
                    <div class="menuCard" id="setupCard">
                        <input id="nameInput" placeholder="Enter Name" maxlength="15">
                        <br/>
                        <div id="enterGame" class="menuButton disabled">
                            <span>Enter Game</span>
                        </div>
                    </div>
                </div>
                <div id="rightCardHolder">
                    <div class="menuCard" id="guideCard">
                        <div class="menuHeader">Servers</div>
                        <div id="serverBrowser"></div>
                        <div id="altServer"></div>
                        <div class="menuHeader" style="margin-top:10px">Select Color</div>
                        <div id="skinColorHolder"></div>
                        <div class="menuHeader" style="margin-top:10px">How To Play</div>
                        <div class="menuText">Collect resources around the map to build a village. Your Windmills generate gold over time. But make sure to protect them from other players.</div>
                        <div class="menuHeader">Controls</div>
                        <div id="desktopInstructions" class="menuText">
                            Movement: W, A, S, D<br/>
                            Look: Mouse<br/>
                            Gather/Attack: Mouse or Space<br/>
                            Auto Attack: E<br/>
                            Select Item: 1-9 or Click<br/>
                            Quick Select Food: Q<br/>
                            Lock Rotation: X<br/>
                            Ping Minimap: R<br/>
                            Add Map Marker: C<br/>
                            Chat: Enter Key<br/>Close Windows: ESC
                        </div>
                        <div id="mobileInstructions" class="menuText">
                            Movement: Drag on left side of screen<br/>
                            Gather/Attack: Drag on right side of screen<br/>
                            Select Item: Touch item at bottom<br/>
                            Ping Minimap: Touch map<br/>
                        </div>
                        <div class="menuHeader">Settings</div>
                        <div class="settingRadio">
                            <input id="nativeResolution" type="checkbox"/>Use Native Resolution
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="menuSettingsButton" class="ytLink">
            <i class="material-icons" style="font-size:30px;vertical-align:middle">&#xE8B8;</i>
            <span>Settings</span>
        </div>
        <div id="partyButton" class="inParty">
            <span></span>
            <i class="material-icons" style="font-size:30px;vertical-align:middle">&#xE8D3;</i>
        </div>
        <div id="joinPartyButton" class="ytLink">
            <span>Join Party</span>
            <i class="material-icons" style="font-size:30px;vertical-align:middle">&#xE0DA;</i>
        </div>
        <div id="linksContainer2">
            <a href="./docs/versions.txt" target="_blank" class="menuLink">v1.8.2</a>
            | <a href="https://discord.gg/MqpUzka" target="_blank" class="menuLink">Discord</a>
            | <a href="https://frvr.com/legal#TermsofService" target="_blank" class="menuLink">Terms</a>
            | <a href="https://frvr.com/legal#PrivacyPolicy" target="_blank" class="menuLink">Privacy</a>
        </div>
    </div>
    <div id="statsDisplay" hidden><span id="st-ping">0ms</span> <span id="st-fps">0fps</span> <span id="st-pps">0pps</span> <span id="st-perf">0pt</span> <span id="st-tick">0tps</span></div>
    <div id="diedText">YOU DIED</div>
    <div id="touch-controls-left"></div>
    <div id="touch-controls-right"></div>
    <div id="touch-controls-fullscreen"></div>
    <div id="gameUI" style="display:none">
        <div id="chatHolder" style="display:none">
            <input id="chatBox" placeholder="Enter Message" maxlength="30">
        </div>
        <div id="upgradeHolder"></div>
        <div id="upgradeCounter"></div>
        <div id="topInfoHolder">
            <div id="leaderboard">
                Leaderboard<div id="leaderboardData"></div>
                <hr class="panelSep">
                <div id="panel">
                    <div class="panelHeader">
                        <span id="panelTitle" class="panelTitle">0:00</span>
                        <div class="panelTabs">
                            <span class="panelTab active" data-page="1">1</span>
                            <span class="panelTab" data-page="2">2</span>
                        </div>
                    </div>
                    <div class="panelPage" id="panelPage1">
                        <div class="panelBtns">
                            <span class="panelBtn" id="panelUpDH" title="Daggers + Great Hammer">up. DH</span>
                            <span class="panelBtn" id="panelUpPH" title="Polearm + Great Hammer">up. PH</span>
                        </div>
                        <div class="panelRight">
                            <div class="panelInvRow">
                                <div class="panelInv" id="panelInv"></div>
                            </div>
                        </div>
                    </div>
                    <div class="panelPage" id="panelPage2" hidden>
                        <div class="panelStats">
                            <span id="panelPriXP" class="panelStat">primary XP: 0/0</span>
                            <span id="panelSecXP" class="panelStat">secondary XP: 0/0</span>
                        </div>
                        <div class="panelFarmRow">
                            <span class="panelBtn" id="panelFarm">auto farm primary</span>
                        </div>
                    </div>
                </div>
            </div>
            <div></div>
            <div id="killCounter" class="resourceDisplay"></div>
        </div>
        <div id="itemInfoHolder" class="uiElement"></div>
        <div id="resDisplay">
            <div id="foodDisplay" class="resourceDisplay"></div>
            <div id="woodDisplay" class="resourceDisplay"></div>
            <div id="stoneDisplay" class="resourceDisplay"></div>
            <div id="scoreDisplay" class="resourceDisplay"></div>
        </div>
        <div id="bottomContainer">
            <div id="ageText"></div>
            <div id="ageBarContainer">
                <div id="reloadBar"><div id="reloadInner">
                    <div class="reloadTrack"><div id="reloadPrimary" class="reloadFill"></div></div>
                    <div class="reloadTrack"><div id="reloadSecondary" class="reloadFill"></div></div>
                </div></div>
                <div id="healthBar"><div id="healthInner">
                    <div id="healthBarBody"></div>
                    <div id="healthThreatBar"></div>
                </div></div>
            </div>
            <div id="actionBar"></div>
        </div>
        <div id="noticationDisplay" style="display:none"></div>
        <div id="allianceButton" class="uiElement gameButton">
            <i class="material-icons" style="font-size:40px;vertical-align:middle">&#xE8D3;</i>
        </div>
        <div id="leaderboardButton" class="uiElement gameButton">
            <i class="material-icons" style="font-size:40px;vertical-align:middle">leaderboard</i>
        </div>
        <div id="storeButton" class="uiElement gameButton">
            <i class="material-icons" style="font-size:40px;vertical-align:middle">&#xE8D1;</i>
        </div>
        <div id="settingsButton" class="uiElement gameButton">
            <i class="material-icons" style="font-size:40px;vertical-align:middle">settings</i>
        </div>
        <canvas id="biomeImage"></canvas>
        <canvas id="mapDisplay"></canvas>
        <div id="storeMenu">
            <div style="padding-bottom:15px">
                <div class="storeTab" style="margin-right:10px" onclick="changeStoreIndex(0)">Hats</div>
                <div class="storeTab" style="margin-right:10px" onclick="changeStoreIndex(1)">Accessories</div>
                <div class="storeTab mmOnlyTab" onclick="changeStoreIndex(2)">Texture Pack</div>
            </div>
            <div id="storeHolder"></div>
        </div>
        <div id="allianceMenu">
            <div id="allianceHolder"></div>
            <div id="allianceManager"></div>
        </div>
        <div id="settingsMenu">
            <div id="settingsTabs"></div>
            <div id="settingsHolder">
                <div id="settingsBody"></div>
            </div>
        </div>
    </div>
    <canvas id="gameCanvas"></canvas>
    <div id="cdm-zone-end"></div>
`;

var css = `
@import url('https://fonts.googleapis.com/css?family=Lilita+One');


    html, body {
        background-color: #000;
        overflow: hidden;
    }

    html, body {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    ::-webkit-input-placeholder {
        color:    #cecece;
    }
    :-moz-placeholder {
        color:    #cecece;
        opacity:  1;
    }
    ::-moz-placeholder {
        color:    #cecece;
        opacity:  1;
    }
    :-ms-input-placeholder {
        color:    #cecece;
    }

    input[type=text] {
        -webkit-touch-callout: text;
        -webkit-user-select: text;
        -khtml-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
    }

    .menuLink {
        font-size: 20px;
    }
    a {
        color: #a56dc8;
        text-decoration: none;
    }
    a:active {
        color: #795094;
    }
    a:visited {
        color: #a56dc8;
    }
    a:hover {
        color: #795094;
    }

    * {
        font-family: 'Hammersmith One';
        font-size: 12px;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    span {
        font-size: inherit;
    }

    #errorNotification {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        max-width: 500px;
        z-index: 99999;
    }

    #errorNotification .errorClose {
        position: absolute;
        top: 5px;
        left: 5px;
    }

    .ytLink {
        color: #6eb3ef;
        font-size: 24px;
        text-decoration: none;
    }

    .ytLink:hover {
        color: #5c96c9;
    }

    #mainMenu {
        background-color: rgba(0,0,0,0.5);
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;
    }

    #menuContainer {
        width: 100%;
        white-space: nowrap;
        text-align: center;
        position: absolute;
        top: 45%;
        transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -o-transform: translateY(-50%);
    }

    #soundSetting {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    #partyButton {
        position: absolute;
        color: white;
        top: 20px;
        right: 20px;
        font-size: 24px;
        text-decoration: none;
    }

    #joinPartyButton {
        position: absolute;
        top: 54px;
        right: 20px;
        cursor: pointer;
    }

    #statsDisplay {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 11px;
        white-space: nowrap;
        z-index: 100;
        pointer-events: none;
    }

    #statsDisplay span {
        font-size: 11px;
    }

    #statsDisplay.vanillaStats #st-fps,
    #statsDisplay.vanillaStats #st-pps,
    #statsDisplay.vanillaStats #st-perf,
    #statsDisplay.vanillaStats #st-tick {
        display: none;
    }

    body.vanillaUi #statsDisplay {
        top: 20px;
        font-size: 12px;
    }
    body.vanillaUi #statsDisplay span {
        font-size: 12px;
    }

    #shutdownDisplay {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 25px;
        z-index: 100;
        pointer-events: none;
    }

    #menuSettingsButton {
        position: absolute;
        cursor: pointer;
        display: none;
    }

    #followText {
        position: absolute;
        bottom: 40px;
        left: 10px;
        color: #fff;
        font-size: 22px;
    }

    #twitterFollow {
        position: absolute;
        bottom: 10px;
        left: 10px;
    }

    #youtubeFollow {
        position: absolute;
        bottom: 10px;
        left: 10px;
    }

    #linksContainer1 {
        border-radius: 4px;
        position: absolute;
        bottom: 0px;
        left: 0px;
        background-color: #fff;
        font-size: 20px;
        padding: 8px;
        -webkit-border-radius: 0 4px 0 0;
        -moz-border-radius: 0 4px 0 0;
        border-radius: 0 4px 0 0;
    }

    #linksContainer2 {
        border-radius: 4px;
        position: absolute;
        bottom: 0px;
        right: 0px;
        background-color: #fff;
        text-align: right;
        font-size: 20px;
        padding: 8px;
        -webkit-border-radius: 4px 0 0 0;
        -moz-border-radius: 4px 0 0 0;
        border-radius: 4px 0 0 0;
    }

    #loadingText {
        font-size: 45px;
        color: #fff;
        text-align: center;
    }

    #loadingText a {
        display: block;
    }

    .menuCard {
        vertical-align: top;
        text-align: left;
        white-space: normal;
        word-wrap: break-word;
        margin: 5px;
        display: inline-block;
        width: 300px;
        padding: 18px;
        background-color: #fff;
        -moz-box-shadow: 0px 7px #c4c4c4;
        -webkit-box-shadow: 0px 7px #c4c4c4;
        box-shadow: 0px 7px #c4c4c4;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        overflow: hidden;
    }

    .menuHeader {
        font-size: 24px;
        color: #292929;
        margin-bottom: 5px;
    }

    .menuText {
        font-size: 18px;
        color: #a8a8a8;
        margin-bottom: 10px;
    }

    #serverBrowser select {
        width: 100%;
        height: 24px;
    }

    #altServer {
        width: 100%;
        text-align: center;
        margin-top: 10px;
    }

    #skinColorHolder {
        width: 100%;
        padding: 0px;
        padding-top: 5px;
        padding-bottom: 0px;
    }

    .activeSkin {
        -webkit-border-radius: 8px !important;
        -moz-border-radius: 8px !important;
        border-radius: 8px !important;
    }

    .skinColorItem {
        cursor: pointer;
        display: inline-block;
        margin-right: 10px;
        width: 30px;
        height: 30px;
        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
        border-radius: 20px;
        border: 3px solid #525252;
    }

    .skinColorItem:hover {
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
    }

    .settingRadio {
        font-size: 18px;
        color: #a8a8a8;
        margin-bottom: 10px;
    }

    #gameName {
        font-size: 170px;
        margin-bottom: -25px;
        text-shadow:
                0 1px 0 #c4c4c4,
                0 2px 0 #c4c4c4,
                0 3px 0 #c4c4c4,
                0 4px 0 #c4c4c4,
                0 5px 0 #c4c4c4,
                0 6px 0 #c4c4c4,
                0 7px 0 #c4c4c4,
                0 8px 0 #c4c4c4,
                0 9px 0 #c4c4c4;
        color: #fff;
    }

    #guideCard {
        max-height: 250px;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }

    #guideCard #smallLinks {
        display: none;
    }

    #guideCard #desktopInstructions {
        display: block;
    }

    #guideCard #mobileInstructions {
        display: none;
    }

    #guideCard.touch #desktopInstructions {
        display: none;
    }

    #guideCard.touch #mobileInstructions {
        display: block;
    }

    #rightCardHolder {
        display: inline-block;
        vertical-align: top;
    }

    #downloadButtonContainer {
        display: block;
        text-align: center;
        padding-bottom: 12px;
        margin-top: 14px;
    }

    #downloadButtonContainer.cordova {
        display: none;
    }

    #mobileDownloadButtonContainer {
        display: none;
    }

    #mobileDownloadButtonContainer.cordova {
        display: none;
    }

    .downloadBadge {
        margin: 0 6px 0 6px;
    }

    .downloadBadge img {
        height: 40px;
    }

    #nameInput {
        text-align: center;
        font-size: 26px;
        margin-bottom: 16px;
        padding: 6px;
        border: none;
        outline: none;
        box-sizing: border-box;
        color: #4A4A4A;
        background-color: #e5e3e3;
        width: 100%;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .menuButton.disabled { color: #CCC; background-color: #666; pointer-events: none; }
    .menuButton {
        text-align: center;
        font-size: 23px;
        padding: 6px;
        box-sizing: border-box;
        color: #fff;
        background-color: #7ee559;
        width: 100%;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        cursor: pointer;
    }

    .menuButton:hover {
        background-color: #6fc94e;
    }

    #gameUI {
        pointer-events: none;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
    }

    #chatHolder {
        position: absolute;
        bottom: 200px;
        width: 100%;
        text-align: center;
    }

    #chatBox {
        padding: 6px;
        font-size: 20px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        pointer-events: all;
        border: 0;
    }
    #chatBox:focus {
        outline: none;
    }

    #topInfoHolder {
        position: absolute;
        right: 20px;
        top: 20px;
    }

    #leaderboard {
        color: #fff;
        font-size: 31px;
        text-align: left;
        padding: 10px;
        padding-top: 7px;
        padding-bottom: 5px;
        width: 220px;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .panelSep {
        border: none;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        margin: 7px 0 6px;
    }

    #panel {
        font-size: 11px;
        line-height: 1.4;
        color: rgba(255, 255, 255, 0.85);
    }

    #panel .panelHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    #panel .panelTitle {
        font-size: 14px;
        color: #fff;
    }

    #panel .panelTabs {
        display: flex;
        gap: 4px;
    }

    #panel .panelTab {
        pointer-events: all;
        cursor: pointer;
        width: 17.3px;
        height: 17.3px;
        line-height: 17.3px;
        text-align: center;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.7);
        background-color: rgba(255, 255, 255, 0.12);
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    #panel .panelTab:hover {
        background-color: rgba(255, 255, 255, 0.22);
    }

    #panel .panelTab.active {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.38);
    }

    #panel .panelPage {
        margin-top: 4px;
    }

    #panel .panelStat {
        display: block;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.75);
    }


    #panel #panelPage1:not([hidden]) {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    #panel #panelPage2:not([hidden]) {
        display: flex;
        flex-direction: column;
        gap: 9px;
    }

    #panel .panelFarmRow {
        display: flex;
        margin-bottom: 4px;
    }

    #panel .panelFarmRow .panelBtn {
        padding: 0 9px;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.78);
    }

    #panel .panelBtn.disabled {
        opacity: 0.4;
        pointer-events: none;
    }

    #panel .panelRight {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
    }

    #panel .panelInv {
        display: grid;
        --panelInvCell: 17.3px;
        gap: 4px;
    }

    #panel .panelInvItem {
        width: var(--panelInvCell);
        height: var(--panelInvCell);
        background-size: 17px 17px;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 3px;
        background-color: rgba(255, 255, 255, 0.1);
        opacity: 0.3;
        filter: grayscale(1);
    }

    #panel .panelInvItem.owned {
        opacity: 1;
        filter: none;
        background-color: rgba(255, 255, 255, 0.12);
    }

    #panel .panelInvItem.equipped {
        background-color: rgba(255, 255, 255, 0.38);
    }

    #panel .panelInvRow {
        display: flex;
        gap: 4px;
        align-items: flex-start;
        margin-top: 2px;
    }

    #chatLog {
        position: fixed;
        top: 0;
        left: 0;
        width: 400px;
        height: 250px;
        background: rgba(0, 0, 0, 0);
        color: white;
        opacity: 1;
        font-family: "Hammersmith One";
        border-bottom-right-radius: 8px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        z-index: 9;
        pointer-events: none;
    }

    #messageContainer {
        height: 400px;
        overflow-y: auto;
        padding-left: 5px;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        pointer-events: auto;
    }

    #messageContainer::-webkit-scrollbar {
        width: 5px;
    }

    #messageContainer::-webkit-scrollbar-track {
        background: transparent;
    }

    #messageContainer::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
    }

    #chatLog .chat-input {
        height: 30px;
        background-color: rgba(255, 255, 255, 0);
        border: none;
        border-radius: 4px;
        outline: none;
        color: white;
        padding: 5px 5px 5px 3px;
        text-indent: 2px;
        pointer-events: auto;
        text-shadow: var(--darkOutline, #2b2d30) 2px 0px 0px, var(--darkOutline, #2b2d30) 1.75517px 0.958851px 0px, var(--darkOutline, #2b2d30) 1.0806px 1.68294px 0px, var(--darkOutline, #2b2d30) 0.141474px 1.99499px 0px, var(--darkOutline, #2b2d30) -0.832294px 1.81859px 0px, var(--darkOutline, #2b2d30) -1.60229px 1.19694px 0px, var(--darkOutline, #2b2d30) -1.97998px 0.28224px 0px, var(--darkOutline, #2b2d30) -1.87291px -0.701566px 0px, var(--darkOutline, #2b2d30) -1.30729px -1.5136px 0px, var(--darkOutline, #2b2d30) -0.421592px -1.95506px 0px, var(--darkOutline, #2b2d30) 0.567324px -1.91785px 0px, var(--darkOutline, #2b2d30) 1.41734px -1.41108px 0px, var(--darkOutline, #2b2d30) 1.92034px -0.558831px 0px;
    }

    #chatLog .chat-input::placeholder {
        color: white;
        opacity: 0.85;
        text-shadow: var(--darkOutline, #2b2d30) 2px 0px 0px, var(--darkOutline, #2b2d30) 1.75517px 0.958851px 0px, var(--darkOutline, #2b2d30) 1.0806px 1.68294px 0px, var(--darkOutline, #2b2d30) 0.141474px 1.99499px 0px, var(--darkOutline, #2b2d30) -0.832294px 1.81859px 0px, var(--darkOutline, #2b2d30) -1.60229px 1.19694px 0px, var(--darkOutline, #2b2d30) -1.97998px 0.28224px 0px, var(--darkOutline, #2b2d30) -1.87291px -0.701566px 0px, var(--darkOutline, #2b2d30) -1.30729px -1.5136px 0px, var(--darkOutline, #2b2d30) -0.421592px -1.95506px 0px, var(--darkOutline, #2b2d30) 0.567324px -1.91785px 0px, var(--darkOutline, #2b2d30) 1.41734px -1.41108px 0px, var(--darkOutline, #2b2d30) 1.92034px -0.558831px 0px;
    }

    #chatLog .chat-input:focus::placeholder {
        opacity: 0;
    }

    .logMessage {
        word-wrap: break-word;
        text-shadow: var(--darkOutline, #2b2d30) 2px 0px 0px, var(--darkOutline, #2b2d30) 1.75517px 0.958851px 0px, var(--darkOutline, #2b2d30) 1.0806px 1.68294px 0px, var(--darkOutline, #2b2d30) 0.141474px 1.99499px 0px, var(--darkOutline, #2b2d30) -0.832294px 1.81859px 0px, var(--darkOutline, #2b2d30) -1.60229px 1.19694px 0px, var(--darkOutline, #2b2d30) -1.97998px 0.28224px 0px, var(--darkOutline, #2b2d30) -1.87291px -0.701566px 0px, var(--darkOutline, #2b2d30) -1.30729px -1.5136px 0px, var(--darkOutline, #2b2d30) -0.421592px -1.95506px 0px, var(--darkOutline, #2b2d30) 0.567324px -1.91785px 0px, var(--darkOutline, #2b2d30) 1.41734px -1.41108px 0px, var(--darkOutline, #2b2d30) 1.92034px -0.558831px 0px;
    }

    .logMessage .darken {
        color: rgba(255, 255, 255, 0.5);
        margin-right: 5px;
    }

    .logMessage .messageContent {
        color: white;
    }

    .logMessage .messageContent.insta {
        color: #5c0620;
    }

    .logDelete {
        display: inline-block;
        position: relative;
        top: 2px;
        margin-left: 6px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 1.6em;
        line-height: 0;
        font-weight: bold;
        cursor: pointer;
        text-shadow: var(--darkOutline, #2b2d30) 2px 0px 0px, var(--darkOutline, #2b2d30) 1.75517px 0.958851px 0px, var(--darkOutline, #2b2d30) 1.0806px 1.68294px 0px, var(--darkOutline, #2b2d30) 0.141474px 1.99499px 0px, var(--darkOutline, #2b2d30) -0.832294px 1.81859px 0px, var(--darkOutline, #2b2d30) -1.60229px 1.19694px 0px, var(--darkOutline, #2b2d30) -1.97998px 0.28224px 0px, var(--darkOutline, #2b2d30) -1.87291px -0.701566px 0px, var(--darkOutline, #2b2d30) -1.30729px -1.5136px 0px, var(--darkOutline, #2b2d30) -0.421592px -1.95506px 0px, var(--darkOutline, #2b2d30) 0.567324px -1.91785px 0px, var(--darkOutline, #2b2d30) 1.41734px -1.41108px 0px, var(--darkOutline, #2b2d30) 1.92034px -0.558831px 0px;
    }

    .logDelete:hover {
        color: #ff5c5c;
    }

    #panel .panelBtns {
        display: grid;
        grid-template-columns: 1fr;
        flex: none;
        gap: 4px;
        width: 46px;
        margin-top: 2px;
        margin-bottom: 4px;
    }

    #panel .panelBtn {
        pointer-events: all;
        cursor: pointer;
        min-width: 0;
        height: 17.3px;
        line-height: 17.3px;
        padding: 0 3px;
        text-align: center;
        white-space: nowrap;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.85);
        background-color: rgba(255, 255, 255, 0.09);
        border: none;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    #panel .panelBtn:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.22);
    }

    #panel .panelBtn:active {
        box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.28);
    }

    #panel .panelBtn.selected {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.38);
    }

    #panel .panelBtns .panelBtn {
        font-size: 9.3px;
        color: rgba(255, 255, 255, 0.78);
    }
    #panel .panelBtns .panelBtn:hover,
    #panel .panelBtns .panelBtn.selected {
        color: #fff;
    }

    .leaderHolder {
        overflow: hidden;
        white-space: nowrap;
    }

    #killCounter {
        right: 0px;
        margin-top: 10px;
        color: #fff;
        font-size: 28px;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        background-image: url(../img/icons/skull.png);
    }

    .leaderScore {
        text-align: right;
        float: right;
        margin-left: 10px;
        display: inline-block;
        font-size: 14px;
    }

    .leaderboardItem {
        float: left;
        display: inline-block;
        max-width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        font-size: 14px;
    }

    .uiElement, .resourceDisplay {
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: #fff;
        padding: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 28px;
    }

    .resourceDisplay {
        position: absolute;
        right: 20px;
        height: 35px;
        text-align: right;
        line-height: 39px;
        padding-left: 10px;
        padding-right: 40px;
        background-size: 28px;
        background-repeat: no-repeat;
        background-position: right 6px center;
    }

    #foodDisplay {
        background-image: url(../img/resources/food_ico.png);
    }

    #woodDisplay {
        background-image: url(../img/resources/wood_ico.png);
    }

    #stoneDisplay {
        background-image: url(../img/resources/stone_ico.png);
    }

    #scoreDisplay {
        right: inherit;
        left: 20px;
        bottom: 160px;
        text-align: left;
        padding-left: 40px;
        padding-right: 10px;
        background-position: left 6px center;
        background-image: url(../img/resources/gold_ico.png);
    }

    #stoneDisplay {
        bottom: 20px;
    }

    #woodDisplay {
        bottom: 75px;
    }

    #foodDisplay {
        bottom: 130px;
    }

    #actionBar {
        bottom: 17px;
        width: 100%;
        text-align: center;
    }

    .actionBarItem {
        width: 66px;
        height: 66px;
        margin-left: 5px;
        margin-right: 5px;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        display: inline-block;
        cursor: pointer;
        pointer-events: all;
        background-size: cover;
        position: relative;
    }

    .actionBarItem:hover {
        background-color: rgba(50, 50, 50, 0.25);
    }

    .itemCounter {
        position: absolute;
        top: 3px;
        right: 3px;
        font-size: 0.95em;
        color: #fff;
        pointer-events: none;
        text-shadow: #3d3f42 2px 0px 0px, #3d3f42 1.75517px 0.958851px 0px, #3d3f42 1.0806px 1.68294px 0px, #3d3f42 0.141474px 1.99499px 0px, #3d3f42 -0.832294px 1.81859px 0px, #3d3f42 -1.60229px 1.19694px 0px, #3d3f42 -1.97998px 0.28224px 0px, #3d3f42 -1.87291px -0.701566px 0px, #3d3f42 -1.30729px -1.5136px 0px, #3d3f42 -0.421592px -1.95506px 0px, #3d3f42 0.567324px -1.91785px 0px, #3d3f42 1.41734px -1.41108px 0px, #3d3f42 1.92034px -0.558831px 0px;
    }

    .itemIcon {
        width: 66px;
        height: 66px;
    }

    #mapDisplay {
        position: absolute;
        bottom: 20px;
        left: 20px;
        display: inline-block;
        width: 130px;
        height: 130px;
        pointer-events: all;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    #biomeImage {
        position: absolute;
        bottom: 20px;
        left: 20px;
        display: inline-block;
        width: 130px;
        height: 130px;
        pointer-events: none;
        background-size: cover;
        filter: brightness(1.95);
        opacity: 0.5;
        background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url("https://i.imgur.com/hi5UFH4.png") no-repeat center center;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .gameButton {
        position: absolute;
        top: 20px;
        padding: 5px;
        cursor: pointer;
        pointer-events: all;
    }

    .gameButton:hover {
        background-color: rgba(50, 50, 50, 0.25);
    }

    #allianceButton {
        right: 270px;
    }

    #leaderboardButton {
        display: none;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
    }

    #leaderboardButton:focus {
        outline: none !important;
    }

    #storeButton {
        right: 330px;
    }

    #settingsButton {
        right: 390px;
    }

    #storeMenu {
        display: none;
        width: 100%;
        position: absolute;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -o-transform: translateY(-50%);
    }

    #storeHolder {
        pointer-events: all;
        width: 400px;
        display: inline-block;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: #fff;
        padding: 10px;
        height: 450px;
        max-height: calc(100vh - 200px);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }

    body:not(.mmMenus) .mmOnlyTab { display: none; }

    .storeTab {
        width: 183px;
        font-size: 26px;
        display: inline-block;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: #fff;
        padding: 10px;
        pointer-events: all;
        cursor: pointer;
    }

    .storeTab:hover {
        background-color: rgba(50, 50, 50, 0.25);
    }

    .storeItem {
        color: #fff;
        padding: 5px;
        font-size: 24px;
        text-align: left;
        cursor: pointer;
    }

    .itemPrice {
        margin-top: 5px;
        float: right;
        display: inline-block;
        color: rgba(255,255,255,0.5);
        font-size: 24px;
        padding-right: 5px;
    }

    .hatPreview {
        margin-top: -5px;
        width: 45px;
        height: 45px;
        display: inline-block;
        vertical-align: middle;
        padding-right: 10px;
    }

    #allianceMenu {
        display: none;
        width: 100%;
        position: absolute;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -o-transform: translateY(-50%);
    }

    #allianceHolder {
        pointer-events: all;
        height: 200px;
        max-height: calc(100vh - 260px);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        width: 350px;
        display: inline-block;
        text-align: left;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .allianceItem {
        font-size: 24px;
        color: #fff;
        padding: 5px;
    }

    .joinAlBtn {
        float: right;
        font-size: 24px;
        text-align: right;
        cursor: pointer;
        color: #80eefc;
    }

    .joinAlBtn:hover {
        color: #72d3e0;
    }

    body.mmMenus .storeTab {
        width: auto;
        height: 24px;
        line-height: 24px;
        padding: 0 18px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.85);
        background-color: rgba(255, 255, 255, 0.09);
    }
    body.mmMenus .storeTab:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.22);
    }
    body.mmMenus .storeTab:active {
        box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.28);
    }
    body.mmMenus .storeTab.active {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.38);
    }
    body.mmMenus #storeHolder {
        width: 430px;
        height: 484px;
        padding: 13px;
        overflow-y: auto;
    }
    body.mmMenus #storeHolder::-webkit-scrollbar { width: 5px; }
    body.mmMenus #storeHolder::-webkit-scrollbar-track { background: transparent; }
    body.mmMenus #storeHolder::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }
    body.mmMenus .storeItem {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14.5px;
        padding: 5px 9px;
        margin-bottom: 5px;
        background-color: rgba(255, 255, 255, 0.03);
        border-radius: 3px;
    }
    body.mmMenus .storeItem:hover { background-color: rgba(255, 255, 255, 0.09); }
    body.mmMenus .storeItem > span:first-of-type { flex: 1; text-align: left; }
    body.mmMenus .hatPreview {
        width: 34px;
        height: 34px;
        margin: 0;
        padding: 0;
    }
    body.mmMenus .storeItem .itemPrice {
        float: none;
        order: 1;
        margin: 0;
        padding: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.5);
    }
    body.mmMenus .storeItem .joinAlBtn { order: 2; }
    body.mmMenus .joinAlBtn {
        float: none;
        flex-shrink: 0;
        height: 21px;
        line-height: 21px;
        padding: 0 12px;
        margin: 0 !important;
        font-size: 12px;
        text-align: center;
        color: rgba(255, 255, 255, 0.85);
        background-color: rgba(255, 255, 255, 0.12);
        border-radius: 3px;
    }
    body.mmMenus .joinAlBtn:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.22);
    }
    body.mmMenus #allianceHolder {
        width: 360px;
        height: 300px;
        max-height: calc(100vh - 300px);
        padding: 13px;
    }
    body.mmMenus #allianceHolder::-webkit-scrollbar { width: 5px; }
    body.mmMenus #allianceHolder::-webkit-scrollbar-track { background: transparent; }
    body.mmMenus #allianceHolder::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }
    body.mmMenus .allianceItem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14.5px;
        padding: 6px 9px;
        margin-bottom: 5px;
        background-color: rgba(255, 255, 255, 0.03);
        border-radius: 3px;
    }
    body.mmMenus #allianceInput {
        pointer-events: all;
        height: 32px;
        width: 200px;
        padding: 0 12px;
        margin: 10px 6px 0 0;
        font-size: 14px;
        font-family: inherit;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.25);
        border: none;
        outline: none;
        border-radius: 3px;
        vertical-align: middle;
    }
    body.mmMenus #allianceInput::placeholder { color: rgba(255, 255, 255, 0.35); }
    body.mmMenus .allianceButtonM {
        pointer-events: all;
        cursor: pointer;
        display: inline-block;
        width: auto !important;
        height: 32px;
        line-height: 32px;
        padding: 0 20px;
        margin-top: 10px;
        font-size: 13.5px;
        text-align: center;
        color: rgba(255, 255, 255, 0.85);
        background-color: rgba(255, 255, 255, 0.12);
        border-radius: 3px;
        vertical-align: middle;
    }
    body.mmMenus .allianceButtonM:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.22);
    }

    #leaderboard.vanillaMetrics .leaderboardItem,
    #leaderboard.vanillaMetrics .leaderScore {
        font-size: 22px;
    }

    #leaderboard.vanillaMetrics #panel .panelStat {
        font-size: 12.5px;
    }

    #leaderboard.vanillaMetrics #panel #panelPage1 .panelStat {
        font-size: 11px;
    }

    #leaderboard.vanillaMetrics #panel .panelTitle {
        font-size: 21px;
    }

    #leaderboard.vanillaMetrics #panel .panelInv {
        --panelInvCell: 20px;
    }
    #leaderboard.vanillaMetrics #panel .panelInvItem {
        background-size: 19.5px 19.5px;
    }

    #leaderboard.vanillaMetrics #panel .panelTab {
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
    }

    #leaderboard.vanillaMetrics #panel .panelBtn {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
    }

    #leaderboard.vanillaMetrics #panel .panelBtns .panelBtn {
        font-size: 11.3px;
    }

    #leaderboard.vanillaMetrics #panel .panelFarmRow .panelBtn {
        font-size: 12px;
    }

    body.vanillaUi #healthBar,
    body.vanillaUi #reloadBar {
        box-sizing: content-box;
        padding: 5px;
        width: 314px;
        height: 10px;
        border-radius: 5px;
    }

    body.vanillaUi #reloadBar {
        background: rgba(0, 0, 0, 0.25);
        margin-bottom: 4px;
    }

    #settingsMenu {
        display: none;
        width: 100%;
        position: absolute;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -o-transform: translateY(-50%);
    }

    #settingsHolder {
        pointer-events: all;
        width: 630px;
        display: inline-flex;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: #fff;
        padding: 13px;
        text-align: left;
        height: 470px;
        max-height: calc(100vh - 200px);
    }

    #settingsTabs {
        text-align: center;
        padding-bottom: 15px;
    }

    .settingsTab {
        pointer-events: all;
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        margin: 0 5px;
        height: 22px;
        line-height: 22px;
        padding: 0 11px;
        text-align: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        background-color: rgba(255, 255, 255, 0.12);
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .settingsTab:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.22);
    }

    .settingsTab.active {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.38);
    }

    #settingsBody {
        display: flex;
        flex-direction: column;
        gap: 5.5px;
        margin-top: 4px;
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        margin-right: -13px;
        padding-right: 13px;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    }

    #settingsBody::-webkit-scrollbar {
        width: 5px;
    }

    #settingsBody::-webkit-scrollbar-track {
        background: transparent;
    }

    #settingsBody::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
    }

    .settingsMaster {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 7px;
        margin-bottom: 4px;
        background-color: rgba(255, 255, 255, 0.03);
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .settingsMasterLabel {
        font-size: 10.5px;
        color: rgba(255, 255, 255, 0.66);
    }

    .settingsMasterBtn {
        pointer-events: all;
        cursor: pointer;
        flex-shrink: 0;
        height: 17.5px;
        line-height: 17.5px;
        padding: 0 12px;
        text-align: center;
        font-size: 10.5px;
        color: rgba(255, 255, 255, 0.5);
        background-color: rgba(255, 255, 255, 0.09);
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .settingsMasterBtn:hover {
        color: rgba(255, 255, 255, 0.75);
        background-color: rgba(255, 255, 255, 0.13);
    }

    .settingsMasterBtn:active {
        box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.28);
    }

    .settingsItem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5.5px 0;
    }

    .settingsBind {
        align-items: center;
        justify-content: flex-start;
        padding: 3px 0;
    }

    .settingsBind .settingsLabel {
        font-size: 13.5px;
        color: rgba(255, 255, 255, 0.72);
    }

    .settingsKey {
        flex-shrink: 0;
        min-width: 37px;
        height: 16.5px;
        line-height: 16.5px;
        padding: 0 7px;
        margin-right: 11px;
        text-align: center;
        font-size: 10.8px;
        letter-spacing: 0.5px;
        color: rgba(255, 255, 255, 0.85);
        background-color: rgba(255, 255, 255, 0.12);
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .settingsKeyBtn {
        pointer-events: all;
        cursor: pointer;
    }

    .settingsKeyBtn:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.22);
    }

    .settingsKeyBtn.capturing {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.28);
    }

    .settingsKeyFixed {
        color: rgba(255, 255, 255, 0.38);
        background-color: rgba(255, 255, 255, 0.05);
    }

    .settingsLabel {
        font-size: 13px;
        line-height: 1.35;
        color: rgba(255, 255, 255, 0.85);
    }
    .settingsItem:not(.settingsBind) .settingsLabel {
        transform: translateY(1.5px);
    }

    .settingsRowKey {
        display: inline-block;
        box-sizing: border-box;
        height: 15px;
        margin-left: 7px;
        padding: 0.55px 6px 0 6px;
        font-size: 11px;
        line-height: 15px;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.82);
        background-color: rgba(255, 255, 255, 0.12);
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        vertical-align: middle;
        transform: translateY(-1px);
    }

    .settingsRule {
        flex: 1;
        align-self: center;
        height: 1px;
        margin: 0 13px 0 23.5px;
        background-color: rgba(255, 255, 255, 0.1);
    }

    .settingsToggle {
        pointer-events: all;
        cursor: pointer;
        flex-shrink: 0;
        min-width: 26.5px;
        height: 15.5px;
        line-height: 15.5px;
        padding: 0 9px;
        margin-left: 12px;
        text-align: center;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.7);
        background-color: rgba(255, 255, 255, 0.09);
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .settingsToggle:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.22);
    }

    .settingsToggle:active {
        box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.28);
    }

    .settingsToggle.on {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.38);
    }

    .settingsModeInline {
        display: inline-flex;
        align-items: center;
        margin-left: auto;
    }
    .settingsModeLabel {
        font-size: 11.5px;
        color: rgba(255, 255, 255, 0.6);
        margin-left: 10px;
        transform: translate(0.2px, 0.5px);
    }
    .settingsModeInline + .settingsToggle {
        margin-left: 4.5px;
    }
    .settingsSelect {
        display: inline-flex;
        gap: 4.5px;
        margin-left: 12px;
    }
    .settingsSelectOpt {
        pointer-events: all;
        cursor: pointer;
        min-width: 26.5px;
        height: 15.5px;
        line-height: 15.5px;
        padding: 0 9px;
        text-align: center;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
        background-color: rgba(255, 255, 255, 0.09);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }
    .settingsSelectOpt:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.2);
    }
    .settingsSelectOpt.on {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.32);
    }
    .settingsSelectOpt.disabled {
        opacity: 0.3;
        filter: grayscale(1);
        pointer-events: none;
        cursor: default;
    }

    .notificationText {
        vertical-align: top;
        font-size: 21px;
        color: #fff;
        display: inline-block;
    }

    .notifButton {
        padding: 4px;
        margin-left: 10px;
        display: inline-block;
        cursor: pointer;
        pointer-events: all;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    body.vanillaUi .notificationText {
        font-size: 25px;
    }

    body.vanillaUi .notifButton {
        padding: 5px;
    }

    .notifButton:hover {
        background-color: rgba(50, 50, 50, 0.25);
    }

    #noticationDisplay {
        vertical-align: top;
        position: absolute;
        right: 270px;
        top: 80px;
        text-align: right;
    }

    .allianceButtonM {
        pointer-events: all;
        cursor: pointer;
        margin-top: 10px;
        font-size: 24px;
        color: #fff;
        padding: 5px;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        padding: 5px;
        text-align: center;
        display: inline-block;
    }

    .allianceButtonM:hover {
        background-color: rgba(50, 50, 50, 0.25);
    }

    #allianceInput {
        pointer-events: all;
        font-size: 24px;
        color: #fff;
        padding: 5px;
        background-color: rgba(0, 0, 0, 0.25);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        padding: 5px;
        display: inline-block;
        outline: none;
        border-color: none;
        border: 0;
        -webkit-box-shadow: none;
        box-shadow: none;
        width: 200px;
        margin-right: 10px;
    }

    #itemInfoHolder {
        max-width: 250px;
        display: none;
        position: absolute;
        top: 20px;
        left: 20px;
    }

    #itemInfoHolder.visible {
        display: block;
    }

    #itemInfoName {
        font-size: 30px;
    }

    #itemInfoDesc {
        font-size: 22px;
        color: rgba(255, 255, 255, 0.6);
    }

    .itemInfoReq {
        font-size: 22px;
    }

    .itemInfoReqVal {
        font-size: 22px;
        color: rgba(255, 255, 255, 0.6);
    }

    .itemInfoLmt {
        font-size: 22px;
        position: absolute;
        right: 10px;
        bottom: 6px;
    }

    #ageBarContainer {
        width: 100%;
        bottom: 93px;
        text-align: center;
        margin-bottom: 6px;
    }

    #ageText {
        width: 100%;
        bottom: 118px;
        text-align: center;
        color: #fff;
        font-size: 24px;
    }

    #healthBar, #reloadBar {
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.25);
        padding: 4px;
        width: 314px;
        height: 14px;
        border-radius: 7px;
        display: block;
        margin: 0 auto;
    }

    #reloadBar {
        --overlap: 3.5px;
        margin-bottom: calc(-1 * var(--overlap));
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.25) calc(100% - var(--overlap)), transparent calc(100% - var(--overlap)));
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    #healthBar {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    #healthBar.solo {
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
    }

    #healthInner, #reloadInner {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 3px;
        overflow: hidden;
    }

    #healthBarBody {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: #82c548;
        border-radius: 3px;
    }

    body.vanillaUi #healthBarBody {
        background-color: #8ecc51;
    }

    #healthThreatBar {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0%;
        background-color: #952738;
        border-radius: 3px;
        opacity: 0;
    }

    #reloadInner {
        display: flex;
        gap: 4px;
    }

    .reloadTrack {
        position: relative;
        flex: 1 1 0;
        height: 100%;
        border-radius: 3px;
        overflow: hidden;
    }

    .reloadFill {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        border-radius: 3px;
    }

    #upgradeHolder {
        width: 100%;
        position: absolute;
        text-align: center;
        top: 10px;
    }

    #upgradeCounter {
        width: 100%;
        position: absolute;
        top: 90px;
        text-align: center;
        font-size: 24px;
        color: #fff;
    }

    #gameCanvas {
        width: 100%;
        height: 100%;
        background-color: #b6db66;
        z-index: 1;
    }

    #diedText {
        display: none;
        font-size: 150px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.25);
        width: 100%;
        padding: 0px;
        position: absolute;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        pointer-events: none;
    }

    #force-skip-ad {
        position: absolute;
        top: 8px;
        left: 8px;
    }

    @media only screen and (max-width: 896px) {

        #actionBar {
            max-width: calc(100% - 340px);
            margin-left: 170px;
        }

        #guideCard {
            position: absolute;
            display: none;
            z-index: 10;
            top: calc(50% + 20px);
            left: 50%;
            transform: translate(-50%, -50%);
        }

        #guideCard #smallLinks {
            display: block;
        }

        #guideCard.showing {
            display: block;
        }

        #downloadButtonContainer {
            display: none;
        }

        #mobileDownloadButtonContainer {
            display: block;
            text-align: center;
            margin-top: 16px;
            margin-bottom: -6px;
        }

        .downloadBadge {
            margin: 0 2px 0 2px;
        }

        .downloadBadge img {
            height: 36px;
        }

        #loadingText {
            margin-top: 20px;
        }

        #gameName {
            font-size: 80px;
            text-shadow:
                    0 1px 0 #c4c4c4,
                    0 2px 0 #c4c4c4,
                    0 3px 0 #c4c4c4,
                    0 4px 0 #c4c4c4,
                    0 5px 0 #c4c4c4;
        }

        #menuCardHolder {
            margin-top: 20px;
        }

        #setupCard {
            width: 260px;
            margin-top: 4px;
        }

        #partyButton {
            top: 8px;
            left: 33%;
            right: inherit;
            transform: translateX(-50%);
        }

        #joinPartyButton {
            top: 8px;
            left: 66%;
            right: inherit;
            transform: translateX(-50%);
        }

        #menuSettingsButton {
            display: block;
            bottom: 28px;
            left: 50%;
            transform: translateX(-50%);
        }

        #linksContainer1, #linksContainer2, #youtubeFollow, #twitterFollow {
            display: none;
        }

        #mapDisplay {
            width: 66px;
            height: 66px;
            bottom: unset;
            top: 8px;
            left: 8px;
        }

        #itemInfoHolder {
            max-width: 128px;
            top: inherit;
            top: 8px;
            right: 8px;
            left: inherit;
        }

        #itemInfoName {
            font-size: 22px;
        }

        #itemInfoDesc, #itemInfoDesc, .itemInfoReq, .itemInfoLmt, .itemInfoReqVal {
            font-size: 12px;
        }

        .uiElement, .resourceDisplay {
            font-size: 20px;
        }

        .resourceDisplay, #scoreDisplay {
            right: inherit;
            left: 8px;
            height: 25px;
            line-height: 27px;

            padding-left: 36px;
            padding-right: 10px;

            background-size: 24px;
            background-position: left 6px center;
        }

        #foodDisplay {
            top: 82px;
            bottom: inherit;
        }

        #woodDisplay {
            top: 124px;
            bottom: inherit;
        }

        #stoneDisplay {
            top: 166px;
            bottom: inherit;
        }

        #scoreDisplay {
            top: 208px;
            left: 8px;
            bottom: inherit;
        }

        #topInfoHolder {
            top: 8px;
            right: 8px;
        }

        #killCounter {
            left: inherit;
            margin-top: 0;
        }

        #actionBar {
            bottom: 8px;
            min-height: 44px;
            max-width: calc(100% - 88px);
            margin-left: 44px;
        }

        .actionBarItem {
            width: 44px;
            height: 44px;
            margin-left: 5px;
            margin-right: 5px;
        }

        #upgradeCounter {
            font-size: 18px;
            top: 58px;
        }

        #ageText {
            bottom: 70px;
            font-size: 16px;
        }

        #ageBarContainer {
            bottom: 54px;
        }

        #healthBar, #reloadBar {
            border-radius: 6px;
            padding: 3px;
            width: 200px;
            height: 12px;
        }


        #leaderboard {
            display: none;
            width: 340px;
            position: fixed;
            top: 50%;
            left: 50%;
            margin-left: -180px;
            margin-top: -100px
        }

        #leaderboard.is-showing {
            display: block;
        }

        #leaderboardData, .leaderHolder, .leaderboardItem, .leaderScore {
            font-size: 18px;
        }

        .leaderScore {
            margin-left: 0;
        }

        #noticationDisplay {
            top: inherit;
            right: inherit;
            left: 50%;
            bottom: 96px;
            transform: translateX(-50%);
            text-align: center;
        }

        .notificationText {
            line-height: 35px;
            font-size: 18px;
            display: block;
        }

        .notifButton {
            padding: 3px 3px 0 3px;
            margin-left: 4px;
            margin-right: 4px;
        }

        #allianceButton {
            top: inherit;
            right: 8px;
        }

        #storeButton {
            top: inherit;
            right: 60px;
        }

        #settingsButton {
            top: inherit;
            right: 112px;
        }

        .gameButton {
            bottom: 8px;
            width: 44px;
            height: 44px;
            padding: 0 !important;
        }

        .gameButton i {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 34px !important;
        }

        .allianceItem, #allianceInput, .allianceButtonM {
            font-size: 18px;
        }

        .storeItem {
            font-size: 18px;
        }

        .hatPreview {
            width: 35px;
            height: 35px;
        }

        .joinAlBtn, .itemPrice {
            font-size: 18px;
        }

        #gameUI {
            height: calc(100% - 15px);
        }

        #itemInfoHolder {
            top: 51px;
        }

        #leaderboardButton {
            display: block;
            right: 8px;
            bottom: 60px;
            top: initial;
        }
    }


    @media only screen and (max-width: 480px) {
        #storeButton {
            top: 8px;
            left: 78px;
        }
        #allianceButton {
            top: 8px;
            left: 126px;
        }

        #leaderboardButton {
            top: 8px;
            left: 174px;
        }

        #settingsButton {
            top: 8px;
            left: 222px;
        }

        #gameName {
            font-size: 60px;
        }

        .storeTab {
            width: 153px;
            font-size: 24px;
        }

        #storeHolder {
            width: 340px;
        }

        #settingsHolder {
            width: 320px;
        }

        #upgradeHolder {
            width: 80%;
            top: 50%;
            left: 10%;
            margin-top: -40px;
        }

        #upgradeCounter {
            top: 50%;
            margin-top: -70px;
            background-color: rgba(50, 50, 50, 0.5);
        }

        #upgradeHolder .actionBarItem {
            width: 66px;
            height: 66px;
        }
    }

    .grecaptcha-badge {
        visibility: collapse !important;
        opacity: 0 !important;
    }

    #touch-controls-left,
    #touch-controls-right,
    #touch-controls-fullscreen {
        position: absolute;
        width: 50%;
        height: 100%;
        top: 0;
        bottom: 0;
        display: none;
    }

    #touch-controls-fullscreen {
        width: 100%;
    }

    #touch-controls-right {
        left: 50%;
    }

    #bottomContainer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
`;

var styles = document.querySelectorAll("link[rel='stylesheet'], style");
for (var i = 0; i < styles.length; i++) {
    var href = styles[i].href || "";
    if (href.indexOf("material-icons") !== -1 || href.indexOf("hammersmith") !== -1) {
        continue;
    }
    if (styles[i].parentNode) {
        styles[i].parentNode.removeChild(styles[i]);
    }
}

var style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);
document.body.innerHTML = html;
