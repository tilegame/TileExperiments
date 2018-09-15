// ================================================
// Cat Sprite
// ------------------------------------------------

{
    // These are the animation styles, mapping to their
    // relevent {X,Y} position on the image.
    //
    // Note: them meaning of the variable name is generally:
    //
    // Variable Name :: {{Direction}}_{{Action}}_{{Index}}
    // Direction     :: S || SW || W || NW || N || NE || E || SE
    // Action        :: WALKING || STANDING || SLEEPING || SITTING
    // Index         :: 0 || 1 || 2 
    // 
    const ANIMATIONS = {
        S_WALKING_1: [0, 0],
        S_STANDING: [1, 0],
        S_WALKING_2: [2, 0],
        SW_WALKING_1: [3, 0],
        SW_STANDING: [4, 0],
        SW_WALKING_2: [5, 0],
        S_JUMPING_1: [6, 0],
        S_JUMPING_2: [7, 0],
        W_WALKING_1: [0, 1],
        W_STANDING: [1, 1],
        W_WALKING_2: [2, 1],
        NW_WALKING_1: [3, 1],
        NW_STANDING: [4, 1],
        NW_WALKING_2: [5, 1],
        W_JUMPING_1: [6, 1],
        W_JUMPING_2: [7, 1],
        E_WALKING_1: [0, 2],
        E_STANDING: [1, 2],
        E_WALKING_2: [2, 2],
        SE_WALKING_1: [3, 2],
        SE_STANDING: [4, 2],
        SE_WALKING_2: [5, 2],
        E_JUMPING_1: [6, 2],
        E_JUMPING_2: [7, 2],
        N_WALKING_1: [0, 2],
        N_STANDING: [1, 2],
        N_WALKING_2: [2, 2],
        NE_WALKING_1: [3, 2],
        NE_STANDING: [4, 2],
        NE_WALKING_2: [5, 2],
        N_JUMPING_1: [6, 3],
        N_JUMPING_2: [7, 3],
        N_SLEEPING_0: [0, 4],
        N_SLEEPING_1: [1, 4],
        N_SLEEPING_2: [2, 4],
        SE_SITTING_0: [3, 4],
        SE_SITTING_1: [4, 4],
        // skipping some right here.
        S_SLEEPING_0: [0, 5],
        S_SLEEPING_1: [1, 5],
        S_SLEEPING_2: [3, 5],
        // more have been skipped.
    }

    // The pixel size of each of the cat tiles.
    const SPOT_SIZE = 32

    // Returns the name of the animation, based on the cat's direction,
    // the action it is taking, and the sequence number of the animation.
    // Resolves certain animation sequences that use the "standing" action
    // as part of it's sequence.
    function getName(direction, action, part) {

        // the standing animation doesn't have multiple 'part' numbers.
        if (action == "STANDING") {
            return `${direction}_STANDING`
        }

        // standing animation is part of the walking sequence.
        if ((action == "WALKING") && (part == 0)) {
            return `${direction}_STANDING`
        }
        return `${direction}_${action}_${part}`
    }

    // getValues returns [x0, y0] pixel location of the relevent cat sprite,
    // based on .
    function getValues(direction, action, part) {
        val = ANIMATIONS[getName(direction, action, part)]
        if (val == undefined) {
            throw new Error(`Invalid animation.`)
        }
        x = val[0] * SPOT_SIZE
        y = val[1] * SPOT_SIZE
        return [x, y]
    }
    
    
}




