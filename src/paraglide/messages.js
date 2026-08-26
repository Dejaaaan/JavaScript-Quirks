// Paraglide JS Messages Module
// Fully typed, direct message functions reading from /messages/en.json and /messages/sr.json
import enMessages from '../../messages/en.json';
import srMessages from '../../messages/sr.json';
import { getLocale } from './runtime';

const dictionaries = {
  en: enMessages,
  sr: srMessages,
};

export function getMessage(key, params = {}) {
  let locale = 'sr';
  try {
    const loc = getLocale();
    if (loc === 'en' || loc === 'sr') {
      locale = loc;
    }
  } catch {
    locale = 'sr';
  }

  const dict = dictionaries[locale] || dictionaries.sr;
  let text = dict[key] || dictionaries.en[key] || dictionaries.sr[key] || key;

  if (params && typeof params === 'object') {
    for (const [paramKey, paramVal] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }
  }
  return text;
}

// Proxy export for all dynamic keys
const messagesProxy = new Proxy({}, {
  get: (_, prop) => (params) => getMessage(prop, params)
});

export default messagesProxy;

// Explicit named exports matching messages/en.json & sr.json
export const app_title = (params) => getMessage('app_title', params);
export const app_subtitle = (params) => getMessage('app_subtitle', params);
export const top_masthead_title = (params) => getMessage('top_masthead_title', params);
export const top_masthead_subtitle = (params) => getMessage('top_masthead_subtitle', params);
export const top_standard = (params) => getMessage('top_standard', params);
export const top_volume = (params) => getMessage('top_volume', params);
export const brand_title = (params) => getMessage('brand_title', params);
export const brand_badge = (params) => getMessage('brand_badge', params);
export const brand_subtitle = (params) => getMessage('brand_subtitle', params);

export const nav_topics = (params) => getMessage('nav_topics', params);
export const nav_coercion = (params) => getMessage('nav_coercion', params);
export const nav_event_loop = (params) => getMessage('nav_event_loop', params);
export const nav_playground = (params) => getMessage('nav_playground', params);
export const nav_leetcode = (params) => getMessage('nav_leetcode', params);
export const nav_quiz = (params) => getMessage('nav_quiz', params);
export const nav_matrix = (params) => getMessage('nav_matrix', params);

export const search_placeholder = (params) => getMessage('search_placeholder', params);
export const filter_saved = (params) => getMessage('filter_saved', params);
export const filter_saved_tooltip = (params) => getMessage('filter_saved_tooltip', params);
export const filter_all_categories = (params) => getMessage('filter_all_categories', params);
export const filter_all_difficulties = (params) => getMessage('filter_all_difficulties', params);
export const filter_reset = (params) => getMessage('filter_reset', params);

export const stat_topics_count = (params) => getMessage('stat_topics_count', params);
export const stat_leetcode_count = (params) => getMessage('stat_leetcode_count', params);
export const stat_bookmarked = (params) => getMessage('stat_bookmarked', params);
export const stat_solved = (params) => getMessage('stat_solved', params);

export const toggle_theme_dark = (params) => getMessage('toggle_theme_dark', params);
export const toggle_theme_light = (params) => getMessage('toggle_theme_light', params);
export const lang_switcher_label = (params) => getMessage('lang_switcher_label', params);
export const lang_sr = (params) => getMessage('lang_sr', params);
export const lang_en = (params) => getMessage('lang_en', params);

export const cat_type_coercion = (params) => getMessage('cat_type_coercion', params);
export const cat_event_loop = (params) => getMessage('cat_event_loop', params);
export const cat_this_context = (params) => getMessage('cat_this_context', params);
export const cat_scope_closures = (params) => getMessage('cat_scope_closures', params);
export const cat_prototypes_oop = (params) => getMessage('cat_prototypes_oop', params);
export const cat_arrays_objects = (params) => getMessage('cat_arrays_objects', params);
export const cat_math_numbers = (params) => getMessage('cat_math_numbers', params);
export const cat_syntax_asi = (params) => getMessage('cat_syntax_asi', params);
export const cat_async_promises = (params) => getMessage('cat_async_promises', params);

export const diff_all = (params) => getMessage('diff_all', params);
export const diff_beginner = (params) => getMessage('diff_beginner', params);
export const diff_intermediate = (params) => getMessage('diff_intermediate', params);
export const diff_advanced = (params) => getMessage('diff_advanced', params);
export const diff_expert = (params) => getMessage('diff_expert', params);
export const diff_easy = (params) => getMessage('diff_easy', params);
export const diff_medium = (params) => getMessage('diff_medium', params);
export const diff_hard = (params) => getMessage('diff_hard', params);

export const quick_leetcode_title = (params) => getMessage('quick_leetcode_title', params);
export const quick_leetcode_desc = (params) => getMessage('quick_leetcode_desc', params);
export const quick_coercion_title = (params) => getMessage('quick_coercion_title', params);
export const quick_coercion_desc = (params) => getMessage('quick_coercion_desc', params);
export const quick_event_loop_title = (params) => getMessage('quick_event_loop_title', params);
export const quick_event_loop_desc = (params) => getMessage('quick_event_loop_desc', params);
export const quick_playground_title = (params) => getMessage('quick_playground_title', params);
export const quick_playground_desc = (params) => getMessage('quick_playground_desc', params);
export const quick_quiz_title = (params) => getMessage('quick_quiz_title', params);
export const quick_quiz_desc = (params) => getMessage('quick_quiz_desc', params);
export const quick_matrix_title = (params) => getMessage('quick_matrix_title', params);
export const quick_matrix_desc = (params) => getMessage('quick_matrix_desc', params);

export const card_badge_deepdive = (params) => getMessage('card_badge_deepdive', params);
export const card_tab_mental_model = (params) => getMessage('card_tab_mental_model', params);
export const card_tab_bad_vs_good = (params) => getMessage('card_tab_bad_vs_good', params);
export const card_tab_visual_lab = (params) => getMessage('card_tab_visual_lab', params);
export const card_tab_cross_lang = (params) => getMessage('card_tab_cross_lang', params);
export const card_under_hood = (params) => getMessage('card_under_hood', params);
export const card_key_concepts = (params) => getMessage('card_key_concepts', params);
export const card_rule_of_thumb = (params) => getMessage('card_rule_of_thumb', params);
export const card_common_pitfall = (params) => getMessage('card_common_pitfall', params);
export const card_bad_practice = (params) => getMessage('card_bad_practice', params);
export const card_good_practice = (params) => getMessage('card_good_practice', params);
export const card_why_issue = (params) => getMessage('card_why_issue', params);
export const card_why_better = (params) => getMessage('card_why_better', params);
export const card_open_playground = (params) => getMessage('card_open_playground', params);
export const card_copy = (params) => getMessage('card_copy', params);
export const card_copied = (params) => getMessage('card_copied', params);
export const card_bookmark = (params) => getMessage('card_bookmark', params);
export const card_bookmarked = (params) => getMessage('card_bookmarked', params);
export const card_no_results = (params) => getMessage('card_no_results', params);

export const lc_badge_interview = (params) => getMessage('lc_badge_interview', params);
export const lc_badge_count = (params) => getMessage('lc_badge_count', params);
export const lc_main_title = (params) => getMessage('lc_main_title', params);
export const lc_main_desc = (params) => getMessage('lc_main_desc', params);
export const lc_your_progress = (params) => getMessage('lc_your_progress', params);
export const lc_saved_local = (params) => getMessage('lc_saved_local', params);
export const lc_search_placeholder = (params) => getMessage('lc_search_placeholder', params);
export const lc_random_btn = (params) => getMessage('lc_random_btn', params);
export const lc_tab_optimal = (params) => getMessage('lc_tab_optimal', params);
export const lc_tab_problem = (params) => getMessage('lc_tab_problem', params);
export const lc_tab_comparison = (params) => getMessage('lc_tab_comparison', params);
export const lc_tab_runner = (params) => getMessage('lc_tab_runner', params);
export const lc_time_complexity = (params) => getMessage('lc_time_complexity', params);
export const lc_space_complexity = (params) => getMessage('lc_space_complexity', params);
export const lc_solution_analysis = (params) => getMessage('lc_solution_analysis', params);
export const lc_js_tips = (params) => getMessage('lc_js_tips', params);
export const lc_problem_statement = (params) => getMessage('lc_problem_statement', params);
export const lc_key_intuition = (params) => getMessage('lc_key_intuition', params);
export const lc_examples_title = (params) => getMessage('lc_examples_title', params);
export const lc_example_num = (params) => getMessage('lc_example_num', params);
export const lc_input_label = (params) => getMessage('lc_input_label', params);
export const lc_output_label = (params) => getMessage('lc_output_label', params);
export const lc_explanation_label = (params) => getMessage('lc_explanation_label', params);
export const lc_constraints_title = (params) => getMessage('lc_constraints_title', params);
export const lc_naive_approach = (params) => getMessage('lc_naive_approach', params);
export const lc_optimal_approach = (params) => getMessage('lc_optimal_approach', params);
export const lc_test_runner_title = (params) => getMessage('lc_test_runner_title', params);
export const lc_test_runner_desc = (params) => getMessage('lc_test_runner_desc', params);
export const lc_run_tests_btn = (params) => getMessage('lc_run_tests_btn', params);
export const lc_running_tests_btn = (params) => getMessage('lc_running_tests_btn', params);
export const lc_test_passed = (params) => getMessage('lc_test_passed', params);
export const lc_test_failed = (params) => getMessage('lc_test_failed', params);
export const lc_actual_output = (params) => getMessage('lc_actual_output', params);
export const lc_error = (params) => getMessage('lc_error', params);
export const lc_prev_problem = (params) => getMessage('lc_prev_problem', params);
export const lc_next_problem = (params) => getMessage('lc_next_problem', params);
export const lc_mark_solved = (params) => getMessage('lc_mark_solved', params);
export const lc_marked_solved = (params) => getMessage('lc_marked_solved', params);
export const lc_copy = (params) => getMessage('lc_copy', params);
export const lc_copied = (params) => getMessage('lc_copied', params);
export const lc_open_leetcode = (params) => getMessage('lc_open_leetcode', params);
export const lc_no_problems_found = (params) => getMessage('lc_no_problems_found', params);

export const quiz_title = (params) => getMessage('quiz_title', params);
export const quiz_desc = (params) => getMessage('quiz_desc', params);
export const quiz_question_num = (params) => getMessage('quiz_question_num', params);
export const quiz_score = (params) => getMessage('quiz_score', params);
export const quiz_next_btn = (params) => getMessage('quiz_next_btn', params);
export const quiz_finish_btn = (params) => getMessage('quiz_finish_btn', params);
export const quiz_restart_btn = (params) => getMessage('quiz_restart_btn', params);
export const quiz_explanation = (params) => getMessage('quiz_explanation', params);
export const quiz_ecma_rule = (params) => getMessage('quiz_ecma_rule', params);
export const quiz_completed_title = (params) => getMessage('quiz_completed_title', params);
export const quiz_final_score = (params) => getMessage('quiz_final_score', params);
export const quiz_mastery_level = (params) => getMessage('quiz_mastery_level', params);
export const quiz_points_scored = (params) => getMessage('quiz_points_scored', params);
export const quiz_streak = (params) => getMessage('quiz_streak', params);
export const quiz_points = (params) => getMessage('quiz_points', params);
export const quiz_prompt = (params) => getMessage('quiz_prompt', params);
export const quiz_explanation_title = (params) => getMessage('quiz_explanation_title', params);
export const quiz_spec_ref = (params) => getMessage('quiz_spec_ref', params);

export const play_title = (params) => getMessage('play_title', params);
export const play_subtitle = (params) => getMessage('play_subtitle', params);
export const play_run_btn = (params) => getMessage('play_run_btn', params);
export const play_clear_btn = (params) => getMessage('play_clear_btn', params);
export const play_reset_code = (params) => getMessage('play_reset_code', params);
export const play_console_output = (params) => getMessage('play_console_output', params);
export const play_execution_time = (params) => getMessage('play_execution_time', params);
export const play_no_output = (params) => getMessage('play_no_output', params);

export const matrix_title = (params) => getMessage('matrix_title', params);
export const matrix_subtitle = (params) => getMessage('matrix_subtitle', params);
export const matrix_tab_all = (params) => getMessage('matrix_tab_all', params);
export const matrix_js_behavior = (params) => getMessage('matrix_js_behavior', params);
export const matrix_other_behavior = (params) => getMessage('matrix_other_behavior', params);
export const matrix_key_contrast = (params) => getMessage('matrix_key_contrast', params);
