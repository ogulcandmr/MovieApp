import mongodb from "mongodb"
const { ObjectId } = mongodb  // destructure ve new ile kullanacağız

let reviews

export default class ReviewsDAO {
    static async injectDB(conn) {
        if(reviews) return
        try {
            reviews = await conn.db("MovieApp").collection("reviews") 
        } catch (e) {
            console.error(`Unable to establish collection handles in ReviewsDAO: ${e}`)
        }
    }

    static async addReview(movieId, user, review) {
        try {
            const idNum = Number(movieId)
            if (isNaN(idNum)) throw new Error("Invalid movieId")

            const reviewDoc = {
                movieId: idNum,
                user,
                review
            }

            return await reviews.insertOne(reviewDoc)
        } catch (e) {
            console.error(`Unable to post review: ${e}`)
            return { error: e }
        }
    }

    static async getReview(reviewId) {
        try {
            return await reviews.findOne({ _id: new ObjectId(reviewId) })
        } catch (e) {
            console.error(`Unable to get review: ${e}`)
            return { error: e }
        }
    }

    static async updateReview(reviewId, user, review) {
        try {
            const updateResponse = await reviews.updateOne(
                { _id: new ObjectId(reviewId) },
                { $set: { user, review } }
            )
            return updateResponse
        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return { error: e }
        }
    }

    static async deleteReview(reviewId) {
        try {
            const deleteResponse = await reviews.deleteOne({ _id: new ObjectId(reviewId) })
            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }

    static async getReviewsByMovieId(movieId) {
        try {
            const idNum = Number(movieId)
            if (isNaN(idNum)) throw new Error("Invalid movieId")

            const cursor = await reviews.find({ movieId: idNum })
            return cursor.toArray()
        } catch (e) {
            console.error(`Unable to get reviews: ${e}`)
            return { error: e }
        }
    }
}