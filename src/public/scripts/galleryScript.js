var resultObject = {list: []};
var intialResultObject = {};

function requestDomain() {

    var name = document.getElementById("inputField").value;
    if (name.substring(0, 4) != "www." || name.charAt(name.length - 4) != '.') {
        alertUser();
        return;
    }
    loading();
    $("#placeHolder").empty();
    if (isPreviousSearches(name)) {
        return;
    }
    var obj = {domain: name};
    $.ajax({
        url: 'http://localhost:3005',
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        processData: false,
        success: function (data, textStatus, jQxhr) {
            debugger;
            removeLoading();
            resultObject.list = [];
            var i = 0;
            for (var j = 0; j < data.length; j++) {
                var obj = JSON.parse(data[j])
                if (obj.image != -1) {
                    resultObject.list[i] = JSON.parse(data[j]);
                    i++;
                }
            }
            showDomains()
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });

}

function isPreviousSearches(domainName) {
    for (i = 0; i < intialResultObject.list.length; i++) {
        if (domainName.toUpperCase() == intialResultObject.list[i].url.toUpperCase()) {
            debugger;
            prevSearchClicked(intialResultObject.list[i].id)
            return true;
        }
    }
    return false;
}

function showDomains() {
    var list = resultObject.list;
    $("#placeHolder").empty();
    for (var i = 0; i < list.length; i++) {
        insertImages(list[i].url, "\"data:image/png;base64, " + list[i].image + '"');
    }
}

function insertImages(domainName, image) {
    var html = " <div class=\"col-sm-6 col-md-4\">\n" +
        "          <div class=\"thumbnail\">\n" +
        "            <a class=\"lightbox\" href=\"domain.html\" target=\"_blank\" onclick=\"showDomainPage(this)\"> \n" +

        "              <img src= " + image + " alt=\"Bridge\" id=" + domainName + " >\n" +
        "            </a>\n" +
        "            <div class=\"caption\">\n" +
        "              <h3>" + domainName + "</h3>" +
        "            </div>\n" +
        "          </div>\n" +
        "        </div>";

    $("#placeHolder").append(html);

}

function startUP() {
    // make request to server and get result objects back. Get all previous searches and return
    $(document).ready(function () {
        $.ajax({
            url: 'http://localhost:3005/getDomains',
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            processData: false,
            success: function (data, textStatus, jQxhr) {
                //console.log(data);
                intialResultObject = data;
                showInitalResultObject();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });
}

function showDomainPage(element) {
    var id = element.firstElementChild.id;
    var img = "\"data:image/png;base64, ";
    var html = "";
    var list = resultObject.list;
    debugger;
    for (var i = 0; i < list.length; i++) {
        debugger;
        if (list[i].url == id) {
            img = img + list[i].image + "\"";
            html = list[i].html;
            break;
        }
    }
    debugger;

    var htmlCode = "<div class=\"h1PlaceHolder\">\n" +
        "    <h1> HTML Report </h1>\n" +
        "</div>\n" +
        "<div class=\"wrap\">\n" +
        "    <div class=\"leftPlaceHolder\">\n" +
        "        <h2 id = \"htmlH2\">SCREENSHOT</h2>\n" +
        "        <img src=" + img + ">\n" +
        "    </div>\n" +
        "    <div class=\"rightPlaceHolder\">\n" +
        "        <h2 id = \"htmlH2\">HTML CODE</h2>\n" +
        "        <textarea id=\"textArea\"></textarea>\n" +
        "    </div>\n" +
        "</div>";

    localStorage.setItem("domainHtml", htmlCode);
    localStorage.setItem("htmlCode", html);

}

function showInitalResultObject() {
    for (i = 0; i < intialResultObject.list.length; i++) {
        showPreviousSearches(intialResultObject.list[i].url, intialResultObject.list[i].id);
    }
}

function showPreviousSearches(domainName, domainID) {
    var html = "<li><a href=\"#\" onclick=\"prevSearchClicked(" + domainID + ")\">" + domainName + "</a></li>\n"
    $("#searchPlaceHolder").append(html);
}

function filterPreviousSearches() {
    var input, filter;
    var ul, li, a, i;
    input = document.getElementById('searchPrevInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("UL");
    li = ul.getElementsByTagName('li');

    var txtValue;
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function prevSearchClicked(givenDomainID) {
    // make a request to db and parse.
    loading();
    removeSideBar();
    changeLoadingText();
    $("#placeHolder").empty();
    var obj = {domain: givenDomainID};
    $.ajax({
        url: 'http://localhost:3005/getDomainVariants',
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        processData: false,
        success: function (data, textStatus, jQxhr) {
            removeLoading();
            debugger;
            var list = data.list
            resultObject.list = [];
            var i = 0;
            for (var j = 0; j < list.length; j++) {
                var obj = list[j]
                if (obj.image != -1) {
                    debugger;
                    resultObject.list[i] = list[j];
                    i++;
                }
            }
            showDomains()

        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });


}

function loading() {
    var loading = document.getElementById("load");
    loading.style.display = "block";
    normalText();
}

function removeLoading() {
    var loading = document.getElementById("load");
    loading.style.display = "none";
}

function removeSideBar() {
    var sidePanel = document.getElementById("mySidebar");
    sidePanel.style.width = "0px";
}

function removeError() {
    document.getElementById("error").style.display = "none"
}

function alertUser() {
    $("#placeHolder").empty();
    document.getElementById("error").style.display = "block"
}

function changeLoadingText() {
    var loadingText = document.getElementById("loadingText");
    debugger;
    loadingText.textContent = "   Retrieving from database";
}

function normalText() {
    var loadingText = document.getElementById("loadingText");
    debugger;
    loadingText.textContent = "This may take upto 45 seconds";
}
function auto_grow(element) {
    element.style.height = "5em";
    element.style.height = (element.scrollHeight)+"px";
}
