import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const movieId = parseInt(req.body.movieId)
            const review = req.body.review
            const user = req.body.user

            if(!movieId || !user || !review){
                return res.status(400).json({error: "Missing fields"})
            }

            const reviewResponse = await ReviewsDAO.addReview(movieId, user, review)
            if(reviewResponse.error) throw reviewResponse.error

            res.json({status: "success"})
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    static async apiGetReview(req, res, next) {
        try {
            let id = req.params.id
            if(!id) return res.status(400).json({error: "Missing review id"})

            let review = await ReviewsDAO.getReview(id)
            if (!review) return res.status(404).json({error: "Not found"})
            
            res.json(review)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e.message})
        }
    }

    static async apiUpdateReview(req, res, next) {
        try{
            const reviewId = req.params.id
            const review = req.body.review
            const user = req.body.user
            
            if(!reviewId || !user || !review){
                return res.status(400).json({error: "Missing fields"})
            }

            const reviewResponse = await ReviewsDAO.updateReview(reviewId, user, review)
            if(reviewResponse.error) throw reviewResponse.error

            if (reviewResponse.modifiedCount === 0) {
                return res.status(400).json({error: "Unable to update review"})
            }
            res.json({ status: "success"}) 
        } catch (e) {
            res.status(500).json({ error: e.message})
        }
    }

    static async apiDeleteReview(req, res, next) {
        try{
            const reviewId = req.params.id
            if(!reviewId) return res.status(400).json({error: "Missing review id"})

            const reviewResponse = await ReviewsDAO.deleteReview(reviewId)
            if(reviewResponse.error) throw reviewResponse.error

            res.json({ status: "success"})
        } catch (e) {
            res.status(500).json({error: e.message})
        } 
    }

    static async apiGetReviews(req, res, next) {
        try {
            let movieId = req.params.id
            if(!movieId) return res.status(400).json({error: "Missing movie id"})

            let reviews = await ReviewsDAO.getReviewsByMovieId(movieId)
            if(reviews.error) throw reviews.error

            res.json(reviews)
        }catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e.message})
        }
    }
}