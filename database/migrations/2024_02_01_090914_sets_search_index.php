<?php

use App\Models\FlashcardSets;
use App\Models\SetsSearchTerm;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sets_search_index', function (Blueprint $table) {
            $table->foreignIdFor(FlashcardSets::class);
            $table->foreignIdFor(SetsSearchTerm::class);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('sets_search_index');
    }
};