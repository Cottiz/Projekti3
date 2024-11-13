$(document).ready(function(){
    // Näyttää tai piilottaa kuvan klikkaamalla kategoriaotsikkoa
    $(".category-card h3").click(function() {
        $(this).siblings("img").slideToggle(500); // Näyttää/piilottaa kuvan liukuefektillä
    });
    loadList();

    // Lisää tuote ostoslistalle
    $("#addProduct").click(function(){
        let product = $("#productInput").val().trim();
        let quantity = parseInt($("#quantityInput").val(), 10);
        let category = $("#categorySelect").val();

        // Tyhjentää kentät jos tuote lisätty onnistuneesti
        if(product && category !== "Valitse kategoria" && quantity > 0) {
            addProductToList(product, quantity, category);
            saveList();
            console.log(`Tuote lisätty: ${product}, Määrä: ${quantity}, Kategoria: ${category}`);
            $("#productInput").val('');
            $("#quantityInput").val('1');
            $("#categorySelect").val('Valitse kategoria');
        } else {
            alert('Hupsis! Taisit unohtaa täyttää kentät huolellisesti!');
        }
    });

    
    // Poista valitut tuotteet kategoriasta
    $(".remove-selected").click(function(){
        $(this).siblings(".product-list").find("input[type='checkbox']:checked").each(function(){
            $(this).closest(".product-item").fadeOut(2000, function(){ // Poistetaan tuote hitaasti FadeOut-menetelmällä
                $(this).remove();
            });
        });
        saveList(); // Tallenna muutokset
    });
});

function addProductToList(product, quantity, category){
    // Luo tuotteen HTML-elementin (div-elementin)
    let productItem = $(`
        <div class="product-item" style="display: none;">
            <input type="checkbox" class="mr-2">
            <span>${product} (${quantity} kpl)</span>
        </div>
    `);
    
    // Lisää tuote listaan ja käynnistä fadeIn-efekti
    $(`#${category} .product-list`).append(productItem);
    productItem.fadeIn(2000); // hidas fadeIn-efekti 2000millisekuntia
}

// Tallentaa ostoslistan localStorageen
function saveList() {
    try {
        let list = {};
        $(".category-card").each(function() {
            let category = $(this).attr('id');
            list[category] = [];
            $(this).find(".product-item").each(function() {
                let productText = $(this).find("span").text();
                let [product, quantityText] = productText.split(" (");
                let quantity = parseInt(quantityText);
                list[category].push({ name: product.trim(), quantity: quantity });
            });
        });
        localStorage.setItem('shoppingList', JSON.stringify(list));
    } catch (error) {
        console.error("Error saving list to localStorage:", error);
    }
}

// Lataa ostoslistan localStoragesta
function loadList() {
    try {
        let list = JSON.parse(localStorage.getItem('shoppingList')) || {};
        for (let category in list) {
            if (Array.isArray(list[category])) {
                list[category].forEach(function(item) {
                    if (item && item.name && item.quantity) {
                        addProductToList(item.name, item.quantity, category);
                        console.log(`Ladattu tuote: ${item.name}, Määrä: ${item.quantity}, Kategoria: ${category}`);
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error loading list from localStorage:", error);
    }
}

// Hakee ja lataa tuotteet JSON-tiedostosta
function fetchAndLoadProducts(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Verkkovirhe, tuotteiden lataaminen epäonnistui");
            }
            return response.json(); // Parsii JSON-datan
        })
        .then(products => {
            products.forEach(item => {
                addProductToList(item.name, item.quantity, item.category); // Lisää jokainen tuote listaan
            });
            saveList(); // Tallenna listan tila localStorageen
        })
        .catch(error => {
            console.error(`Virhe ladattaessa tuotteita (${url}):`, error);
            alert("Tuotteiden lataaminen epäonnistui.");
        });
}

// Joululistanappi, joka lataa tuotteet JSON-tiedostosta
document.getElementById("loadProducts").addEventListener("click", function() {
    fetchAndLoadProducts("json/products.json");
});

// Peruslistanappi, joka lataa tuotteet JSON-tiedostosta
document.getElementById("loadPerus").addEventListener("click", function() {
    fetchAndLoadProducts("json/perus.json");
});
