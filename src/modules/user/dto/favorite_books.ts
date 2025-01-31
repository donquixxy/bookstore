import {IsNotEmpty} from "class-validator";
import {Expose} from "class-transformer";

export class FavoriteBookFilter {
    id?:string
    userID?:string
    bookID?:string
}

export class FavoriteBookCreate {
    id:string
    userID:string
    bookID:string

    constructor(id:string,userID:string, bookID:string) {
        this.userID = userID;
        this.bookID = bookID;
        this.id = id
    }
}

export class FavoriteBookDelete {
    id:string;

    constructor(id:string) {
        this.id = id;
    }
}

export class FavoriteBookDTO {
    userID:string;

    @IsNotEmpty()
    @Expose({ name: "book_id" })
    bookID:string;

    constructor(userID:string, bookID:string) {
        this.userID = userID;
        this.bookID = bookID;
    }
}