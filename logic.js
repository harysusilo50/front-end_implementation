const config = window.localStorage;

let allTask = document.getElementById("allTask");
let completedTask = document.getElementById("completedTask");
let unCompletedTask = document.getElementById("unCompletedTask");
let search = document.getElementById("search");
let btnSearch = document.getElementById("btn_search");

function quotesAPI() {
    fetch("https://api.quotable.io/quotes/random")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var content = document.getElementById('content_quotes');
            content.innerText = data[0].content;

            var author = document.getElementById('author_quotes');
            author.innerText = data[0].author;
        });
}

function template(id, judul, deskripsi, keterangan) {
    let isComplete, button;
    if (keterangan == true) {
        isComplete = `<span class="badge bg-secondary mb-4 fw-normal">Selesai</span>`;
        button = `<button class="btn btn-warning text-white" onclick="updateData(${id})">Ubah <i class="bi bi-dash-circle"></i></button>`
    } else {
        isComplete = `<span class="badge bg-warning mb-4 fw-normal">Belum Dilakukan</span>`;
        button = `<button class="btn btn-success" onclick="updateData(${id})">Selesai <i class="bi bi-plus-circle"></i></button>`;
    }

    return `<div class="my-3" id="${id}">
                    <div class="card ">
                        <div class="card-body">
                            <h3 class="card-title">
                                ${judul}
                            </h3>
                            ${isComplete}
                            <div class="d-flex row-cols-2">
                                <div class="col-md-4">
                                    <p>Deskripsi</p>
                                </div>
                                <div class="col-md-8">
                                    <p>${deskripsi}</p>

                                    <div class="d-flex">
                                     <div class="col-md-4">
                                            <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editModal">
                                                Edit
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                        </div>
                                        <div class="col-md-4">
                                            ${button}
                                        </div>
                                        <div class="col-md-4">
                                            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                                Hapus
                                                <i class="bi bi-trash-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="deleteModal" data-backdrop="" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="deleteModalLabel">Peringatan !</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Apakah anda yakin ingin menghapus data ?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                                <button type="button" class="btn btn-danger" onclick="deleteData(${id})">Hapus</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="editModal" data-backdrop="" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editModalLabel">Peringatan !</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="judulKegiatan" class="col-form-label">Judul :</label>
                                    <input type="text" class="form-control" id="editjudulKegiatan" value="${judul}" placeholder="Masukan Judul Kegiatan" required />
                                </div>
                                <div class="mb-3">
                                    <label for="deskripsiKegiatan" class="col-form-label">Deskripsi :</label>
                                    <textarea class="form-control" id="editdeskripsiKegiatan" value="${deskripsi}" rows="4" required>${deskripsi}</textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                                <button type="button" class="btn btn-success" onclick="editData(${id})">Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>
                `
}

function getFormValue(id, judul, deskripsi) {
    data = {
        id: id,
        title: judul,
        description: deskripsi
    }
    return data
}

function getDataFromLocalStorage(id) {
    let data = config.getItem(id);
    let result = JSON.parse(data);
    return result;
}

function addDataToLocalStorage(getFormValue) {
    let id = getFormValue.id;
    let json = JSON.stringify(getFormValue);
    config.setItem(id, json);
}

function submitData(e) {
    let temp = new Date;
    id = temp.getTime();
    judul = document.getElementById("judulKegiatan").value;
    deskripsi = document.getElementById("deskripsiKegiatan").value;

    getFormValue(id, judul, deskripsi);
    addDataToLocalStorage(data);
    var myModal = document.getElementById('formTambahKegiatan');
    var modal = bootstrap.Modal.getInstance(myModal);
    modal.hide();
    document.body.classList.remove('modal-open')
    document.querySelector(".modal-backdrop").remove();
    main();
}

function searchData(e) {
    let datax = {
        ...localStorage
    };
    let titleSearch = search.value;
    let keyObj = Object.keys(datax);
    let arraySearch = [];
    for (let x = 0; x < localStorage.length; x++) {
        let raw = localStorage.getItem(keyObj[x]);
        let data = JSON.parse(raw);
        if (data.title == titleSearch) {
            arraySearch[x] = template(data.id, data.title, data.description, data.isComplete);
        }
    }
    const newArr = arraySearch.filter((a) => a);
    let container = ""
    for (const item of newArr) {
        container += item
    }
    document.getElementById("containerSemuaKegiatan").innerHTML = "";
    document.getElementById("containerSemuaKegiatan").innerHTML = container;
    e.preventDefault();
}

function updateData(id) {
    let data = getDataFromLocalStorage(id);
    data.isComplete = data.isComplete == true ? false : true;
    let json = JSON.stringify(data);
    config.setItem(id, json);
    location.reload();
}

function editData(id) {
    let data = getDataFromLocalStorage(id);
    data.title = document.getElementById("editjudulKegiatan").value;
    data.description = document.getElementById("editdeskripsiKegiatan").value;
    let json = JSON.stringify(data);
    config.setItem(id, json);
    location.reload();
}

function deleteData(id) {
    localStorage.removeItem(id);
    var deleteModal = document.getElementById('deleteModal');
    var delModal = bootstrap.Modal.getInstance(deleteModal);
    delModal.hide();
    document.body.classList.remove('modal-open')
    document.querySelector(".modal-backdrop").remove();
    main();
}

allTask.addEventListener("click", showAllTaskFun);
completedTask.addEventListener("click", showCompletedTaskFun);
unCompletedTask.addEventListener("click", showUnCompletedTaskFun);
btnSearch.addEventListener("click", searchData);

function showAllTask() {
    let datax = {
        ...localStorage
    };
    let keyObj = Object.keys(datax);
    let arraySemuaKegiatan = [];
    for (let x = 0; x < localStorage.length; x++) {
        let raw = localStorage.getItem(keyObj[x]);
        let data = JSON.parse(raw);
        arraySemuaKegiatan[x] = template(data.id, data.title, data.description, data.isComplete);
    }

    let container = ""
    for (const item of arraySemuaKegiatan) {
        container += item
    }
    document.getElementById("containerSemuaKegiatan").innerHTML = "";
    document.getElementById("containerSemuaKegiatan").innerHTML = container;
}

function showCompletedTask() {
    let datax = {
        ...localStorage
    };
    let keyObj = Object.keys(datax);
    let arraySelesaiDilakukan = [];
    for (let x = 0; x < localStorage.length; x++) {
        let raw = localStorage.getItem(keyObj[x]);
        let data = JSON.parse(raw);
        if (data.isComplete == true) {
            arraySelesaiDilakukan[x] = template(data.id, data.title, data.description, data.isComplete);
        }
    }

    const newArr = arraySelesaiDilakukan.filter((a) => a);

    let container = ""
    for (const item of newArr) {
        container += item
    }
    document.getElementById("containerSemuaKegiatan").innerHTML = "";
    document.getElementById("containerSemuaKegiatan").innerHTML = container;
}

function showUnCompletedTask() {
    let datax = {
        ...localStorage
    };
    let keyObj = Object.keys(datax);
    let arrayBelumSelesaiDilakukan = [];
    for (let x = 0; x < localStorage.length; x++) {
        let raw = localStorage.getItem(keyObj[x]);
        let data = JSON.parse(raw);
        if (data.isComplete == false) {
            arrayBelumSelesaiDilakukan[x] = template(data.id, data.title, data.description, data.isComplete);
        }
    }
    const newArr = arrayBelumSelesaiDilakukan.filter((a) => a);
    let container = ""
    for (const item of newArr) {
        container += item
    }
    document.getElementById("containerSemuaKegiatan").innerHTML = "";
    document.getElementById("containerSemuaKegiatan").innerHTML = container;
}

function showAllTaskFun(e) {
    unCompletedTask.classList.remove("active");
    completedTask.classList.remove("active");
    allTask.classList.add("active");
    showAllTask();
    e.preventDefault();
}

function showCompletedTaskFun(e) {
    unCompletedTask.classList.remove("active");
    completedTask.classList.add("active");
    allTask.classList.remove("active");
    showCompletedTask();
    e.preventDefault();
}

function showUnCompletedTaskFun(e) {
    unCompletedTask.classList.add("active");
    completedTask.classList.remove("active");
    allTask.classList.remove("active");
    showUnCompletedTask();
    e.preventDefault();
}

function main() {
    showAllTaskFun();
    showCompletedTaskFun();
    showUnCompletedTaskFun();
    searchData();
}
window.onload = function () {
    quotesAPI();
    main();
}