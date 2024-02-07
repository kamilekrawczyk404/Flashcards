<?php

use App\Models\SetsSearchIndex;
use App\Models\SetsSearchTerm;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flashcard_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class);
            $table->string('title');
            $table->string('description');
            $table->json('languages');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flashcard_sets');

        $tableNames = [];
        $toRemove = [];

        $userNames = array_map(fn ($user) => $user['name'], User::all()->toArray());
        $allTables = DB::connection()->select('select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA = :name', ['name' => DB::getDatabaseName()]);

        foreach($allTables as $table) {
            $tableNames[] = $table->TABLE_NAME;
        }

        foreach($tableNames as $tableName) {
            foreach($userNames as $userName) {
                if(str_contains($userName, $tableName))
                    $toRemove[] = $tableName;
            }
        }

        foreach($toRemove as $key => $tableName) {
            Schema::dropIfExists($tableName[$key]);
        }
    }
};