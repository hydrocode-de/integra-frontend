import { Star, StarHalfOutlined, StarOutline } from "@mui/icons-material"
import { Box } from "@mui/material"

interface StarSelectProps {
    value: number
}

const StarRating: React.FC<StarSelectProps> = ({ value }) => {
    return <>
        <Box display="flex" >
            {/* first star */}
            <Box mr={0.5}>
                { value >= 1 ? <Star /> : value >= 0.5 ? <StarHalfOutlined /> : <StarOutline />}
            </Box>

            {/* second star */}
            <Box mr={0.5}>
                { value >= 2 ? <Star /> : value >= 1.5 ? <StarHalfOutlined /> : <StarOutline />}
            </Box>

            {/* third star */}
            <Box mr={0.5}>
                { value >= 3 ? <Star /> : value >= 2.5 ? <StarHalfOutlined /> : <StarOutline />}
            </Box>

            {/* fourth star */}
            <Box mr={0.5}>
                { value >= 4 ? <Star /> : value >= 3.5 ? <StarHalfOutlined /> : <StarOutline />}
            </Box>

            {/* fifth star */}
            <Box>
                { value >= 5 ? <Star /> : value >= 4.5 ? <StarHalfOutlined /> : <StarOutline />}
            </Box>
        </Box>
    </>
}

export default StarRating