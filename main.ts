interface IUserImage {
    id: number;
    imageLink: string;
    imageAuthor: string;
}

interface IApiImage {
    author: string;
    download_url: string;
    height: number;
    id: string;
    url: string;
    width: number;
}

let userImages: IUserImage[] = [];
let apiImages: IApiImage[] = [];

const search = (e: Event) => {
    e.preventDefault();
    const searchQuery = (
        document.querySelector("#searchInput") as HTMLInputElement
    ).value
        .trim()
        .toLowerCase();
    const filteredUserImages = userImages.filter((img) =>
        img.imageAuthor.toLowerCase().includes(searchQuery)
    );
    const filteredApiImages = apiImages.filter((img) =>
        img.author.toLowerCase().includes(searchQuery)
    );

    renderImages(filteredUserImages, filteredApiImages);
};

const renderImages = async (
    filteredUserImages?: IUserImage[],
    filteredApiImages?: IApiImage[]
) => {
    console.log(filteredUserImages, filteredApiImages);

    if (!filteredUserImages && !filteredApiImages) {
        // @ts-ignore
        let resMokky = await axios.get(
            "https://3c78b48b4cd54ff0.mokky.dev/userImages"
        );
        userImages = resMokky.data;
        userImages.reverse();
        // @ts-ignore
        let res = await axios.get("https://picsum.photos/v2/list?page=4");
        apiImages = res.data;
    }

    let imagesBody: HTMLDivElement | null =
        document.querySelector("#images > .row");
    if (imagesBody) imagesBody.innerHTML = "";

    const userImgsToRender = filteredUserImages || userImages;
    const apiImgsToRender = filteredApiImages || apiImages;

    userImgsToRender.forEach((img) => {
        if (imagesBody) {
            imagesBody.innerHTML += `
                <div class="col-sm-6 col-md-4 col-lg-3 my-2">
                    <div class="card">
                        <img src="${img.imageLink}" class="card-img-top" alt="${img.imageAuthor}" />
                        <div class="card-body">
                            <p class="card-title">${img.imageAuthor}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    apiImgsToRender.forEach((img) => {
        if (imagesBody) {
            imagesBody.innerHTML += `
                <div class="col-sm-6 col-md-4 col-lg-3 my-2">
                    <div class="card">
                        <img src="${img.download_url}" class="card-img-top" alt="${img.author}" />
                        <div class="card-body">
                            <p class="card-title">${img.author}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    });
};

interface INewImage {
    imageLink: string;
    imageAuthor: string;
}

const addImages = async (e: Event) => {
    e.preventDefault();
    let addImageForm: null | HTMLFormElement =
        document.querySelector("#addImageForm");
    if (addImageForm) {
        let newImage: INewImage = {
            imageLink: addImageForm.imageLink.value,
            imageAuthor: addImageForm.imageAuthor.value,
        };
        // @ts-ignore
        await axios.post(
            "https://3c78b48b4cd54ff0.mokky.dev/userImages",
            newImage
        );
        renderImages();
    }
};

document
    .querySelector("#saveNewImage")
    ?.addEventListener("click", (event: Event) => {
        addImages(event);
    });

document
    .querySelector("#searchButton")
    ?.addEventListener("click", (event: Event) => {
        search(event);
    });

window.onload = () => {
    renderImages();
};
