import { router } from "@inertiajs/react";

export const updateTranslationStatus = (
  userId,
  setId,
  translationId,
  isCorrect,
) => {
  router.put("/set/updateTranslationStatus", {
    user_id: userId,
    set_id: setId,
    translation_id: translationId,
    is_correct: isCorrect,
  });
};